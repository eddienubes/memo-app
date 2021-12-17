import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Phrase } from '../entities/phrase.entity';
import {
  IPhraseSearchBody,
  IPhraseSearchResult,
} from '../interfaces/phrase-search-body.interface';

@Injectable()
export class PhraseSearchService {
  private readonly index = 'phrases';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  public indexPhrase(phrase: Phrase) {
    return this.elasticsearchService.index<
      IPhraseSearchResult,
      IPhraseSearchBody
    >({
      index: this.index,
      body: {
        id: phrase.id,
        value: phrase.value,
        definition: phrase.definition.value,
        type: phrase.type,
        owner: phrase.userId,
      },
    });
  }

  public async search(text: string, userId: number) {
    const { body } =
      await this.elasticsearchService.search<IPhraseSearchResult>({
        index: this.index,
        body: {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: text,
                    fields: ['value', 'definition', 'type'],
                  },
                },
                { term: { owner: { value: userId } } },
              ],
            },
          },
        },
      });

    const hits = body.hits.hits;

    return hits.map((item) => item._source);
  }

  public async remove(phraseId: number) {
    this.elasticsearchService.deleteByQuery<IPhraseSearchBody>({
      index: this.index,
      body: {
        query: {
          match: {
            id: phraseId,
          },
        },
      },
    });
  }

  public async update(phrase: Phrase) {
    const newBody: IPhraseSearchBody = {
      id: phrase.id,
      value: phrase.value,
      definition: phrase.definition.value,
      type: phrase.type,
      owner: phrase.userId,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: phrase.id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }
}
