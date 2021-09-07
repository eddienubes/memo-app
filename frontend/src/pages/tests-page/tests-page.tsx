import React, { useState, useEffect, useContext, FormEventHandler } from 'react';
import { Test } from '../../common/types/data';
import ServicesContext from '../../contexts/service-context/service-context';
import TestComponent from '../../components/test';
import { CircularProgress, Grid, SelectChangeEvent } from '@mui/material';
import FloatingButton from "../../components/floating-button";
import ErrorIndicator from "../../components/error-indicator";
import CreateTestsModal from "../../components/create-tests-modal";
import GlobalStateContext from "../../contexts/global-state-context/global-state-context";

const TestsPage = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const { testService, phrasesService } = useContext(ServicesContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [phraseTypes, setPhraseTypes] = useState<string[]>([]);
  const [loadingPhraseTypes, setLoadingPhraseTypes] = useState<boolean>(true);
  const [loadingTests, setLoadingTests] = useState<boolean>(true);
  const [currentType, setCurrentType] = useState<string>('');
  const { dispatch: dispatchGlobalState } = useContext(GlobalStateContext);

  const modalCloseHandler = () => setModalOpen(false);
  const modalOpenHandler = () => setModalOpen(true);

  const formSubmitHandler: FormEventHandler = (e) => {
    e.preventDefault();
    dispatchGlobalState({ type: 'setBackGroundLoading', payload: true });
    modalCloseHandler();

    if (currentType) {
      testService
        .create(currentType)
        .then(tests => {
          setTests(state => {
            return [
              ...tests,
              ...state,
            ];
          });
          dispatchGlobalState({ type: 'setBackGroundLoading', payload: false });
        })
        .catch(e => {
          dispatchGlobalState({ type: 'setError', payload: e })
        });
    }
  }

  const currentTypeChangeHandler = (e: SelectChangeEvent) => {
    e.preventDefault();
    setCurrentType(e.target.value);
  }

  useEffect(() => {
    setLoadingTests(true);
    setLoadingPhraseTypes(true);
    testService
      .findTests()
      .then(tests => {
        setLoadingTests(false);
        setTests(tests);
      })
      .catch(e => {
        dispatchGlobalState({ type: 'setError', payload: e })
        setLoadingTests(false);
      });
    phrasesService
      .findPhraseTypes()
      .then(types => {
        setPhraseTypes(types);
        setLoadingPhraseTypes(false);
      })
      .catch(e => {
        dispatchGlobalState({ type: 'setError', payload: e })
        setLoadingPhraseTypes(false);
      });

  }, [testService, phrasesService, dispatchGlobalState]);

  if (loadingPhraseTypes || loadingTests) {
    return <CircularProgress/>
  }

  return (
    <>
      <FloatingButton onClickHandler={modalOpenHandler}/>
      <CreateTestsModal
        open={modalOpen}
        handleClose={modalCloseHandler}
        handleFormSubmit={formSubmitHandler}
        types={phraseTypes}
        currentType={currentType}
        handleTypeChange={currentTypeChangeHandler}
      />
      <Grid container sx={{ minWidth: 275 }} spacing={5}>
        {
          tests.map(test => {
            return (
              <Grid item xs={12} key={test.id + 'test'}>
                <TestComponent
                  test={{
                    id: test.id,
                    done: test.done,
                    phrase: {
                      id: test.phrase.id,
                      value: test.phrase.value,
                      type: test.phrase.type,
                      userId: test.phrase.userId,
                    },
                    answers: test.answers
                  }}
                />
              </Grid>
            )
          })
        }
      </Grid>
    </>
  )
}

export default TestsPage;