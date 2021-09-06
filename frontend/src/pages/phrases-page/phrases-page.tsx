import React, { useEffect, useState, useContext, useReducer, FormEventHandler } from 'react';
import PhraseCard from '../../components/phrase-card';
import { CircularProgress, Grid } from '@mui/material';
import { Phrase } from '../../common/types/data';
import ServicesContext from '../../contexts/service-context/service-context';
import ErrorIndicator from '../../components/error-indicator';
import CreatePhraseModal from '../../components/create-phrase-modal';
import CreatePhraseButton from '../../components/create-phrase-button';

interface Example {
  id: string;
  value: string
}

export interface PhraseInput {
  phrase: string;
  definition: string;
  examples: Example[]
  type: string;
}

export type Actions =
  { type: 'phrase'; payload: string } |
  { type: 'definition'; payload: string } |
  { type: 'addExamples'; payload: Example } |
  { type: 'deleteExample'; payload: string } |
  { type: 'type'; payload: string } |
  { type: 'reset'; payload: PhraseInput };

const initialState = {
  phrase: '',
  definition: '',
  examples: [],
  type: ''
};

const reducer = (state: PhraseInput, action: Actions) => {
  switch (action.type) {
    case 'phrase':
      return {
        ...state,
        phrase: action.payload,
      }
    case 'definition':
      return {
        ...state,
        definition: action.payload,
      }
    case 'addExamples':
      return {
        ...state,
        examples: [
          action.payload,
          ...state.examples,
        ],
      }
    case 'deleteExample':
      const index = state.examples.findIndex(e => e.id === action.payload);
      return {
        ...state,
        examples: [
          ...state.examples.slice(0, index),
          ...state.examples.slice(index + 1)
        ]
      }
    case 'type':
      return {
        ...state,
        type: action.payload,
      }
    case 'reset':
      return initialState;
    default:
      return state;
  }
}


const PhrasesPage = () => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const { phrasesService } = useContext(ServicesContext);
  const [err, setError] = useState(null);
  const [loadingPhrases, setLoadingPhrases] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loadingPhraseTypes, setLoadingPhraseTypes] = useState<boolean>(true);
  const [phraseTypes, setPhraseTypes] = useState<string[]>([]);

  const [formState, dispatchForm] = useReducer(
    reducer,
    initialState
  );

  const modalCloseHandler = () => setModalOpen(false);
  const modalOpenHandler = () => setModalOpen(true);

  useEffect(() => {
    setLoadingPhrases(true);
    setLoadingPhraseTypes(true);
    phrasesService
      .findPhrases(0, 10)
      .then(phrases => {
        setLoadingPhrases(false);
        setPhrases((state) => {
          return [
            ...phrases,
            ...state
          ];
        });
      })
      .catch(e => {
        setLoadingPhrases(true);
        setError(e);
      });

    phrasesService
      .findPhraseTypes()
      .then(types => {
        setPhraseTypes(types);
        setLoadingPhraseTypes(false);
      })
      .catch(e => {
        setError(e);
        setLoadingPhraseTypes(false);
      });

  }, [phrasesService]);

  const handleFormSubmit: FormEventHandler = (event) => {
    dispatchForm({ type: 'reset', payload: initialState });
    event.preventDefault();
    modalCloseHandler();
    phrasesService
      .create(formState)
      .then(phrase => {
        setPhrases(phrases => {
          return [
            phrase,
            ...phrases,
          ]
        })
      })
      .catch(e => setError(e));

  }


  if (err) {
    return <ErrorIndicator/>;
  }

  if (loadingPhrases || loadingPhraseTypes) {
    return <CircularProgress/>;
  }

  return (
    <>
      <CreatePhraseButton onClickHandler={modalOpenHandler}/>
      <CreatePhraseModal formState={formState}
                         dispatch={dispatchForm}
                         types={phraseTypes}
                         open={modalOpen}
                         handleClose={modalCloseHandler}
                         handleFormSubmit={handleFormSubmit}
      />
      <Grid container spacing={3}>
        {
          phrases.map(phrase => {
            return (
              <Grid item xs key={phrase.id + 'phrase'}>
                <PhraseCard
                  phrase={phrase.value}
                  type={phrase.type}
                  definition={phrase.definition.value}
                  createdAt={phrase.createdAt}
                  examples={phrase.examples}
                />
              </Grid>
            )
          })
        }

      </Grid>
    </>

  )
}


export default PhrasesPage;
