import React, { useContext, useEffect, useReducer } from 'react'

import {
  SET_LOADING,
  SET_STORIES,
  REMOVE_STORY,
  HANDLE_PAGE,
  HANDLE_SEARCH,
} from './actions'
import reducer from './reducer'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?'
// API_ENDPOINT ve initialState: API_ENDPOINT, Hacker News API'nin temel URL'sini tanımlar. initialState ise uygulamanın başlangıç durumunu belirler. Bu durum, başlangıçta yüklenme durumu (isLoading: true), hikayeler (hits: []), arama sorgusu (query: 'react'), sayfa numarası (page: 0) ve toplam sayfa sayısı (nbPages: 0) içerir.

const initialState = {
  isLoading: true,
  hits: [],
  query: 'react',
  page: 0,
  nbPages: 0,
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchStories = async (url) => {
    dispatch({ type: SET_LOADING })
    try {
      const response = await fetch(url)
      const data = await response.json()
      dispatch({
        type: SET_STORIES,
        payload: { hits: data.hits, nbPages: data.nbPages },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const removeStory = (id) => {
    dispatch({ type: REMOVE_STORY, payload: id })
  }
  const handleSearch = (query) => {
    dispatch({ type: HANDLE_SEARCH, payload: query })
  }
  const handlePage = (value) => {
    dispatch({ type: HANDLE_PAGE, payload: value })
    // removeStory, handleSearch, ve handlePage Fonksiyonları: Bu fonksiyonlar, sırasıyla bir hikayeyi kaldırmak, arama sorgusunu güncellemek ve sayfa numarasını güncellemek için kullanılır. Bu fonksiyonlar, uygun eylemi tetikler ve durumu günceller.
  }
  useEffect(() => {
    fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`)
  }, [state.query, state.page])
// useEffect Hook: Bu Hook, uygulama başlangıcında ve belirli durum değişikliklerinde fetchStories fonksiyonunu tetikler. Bu sayede, arama sorgusu veya sayfa numarası değiştiğinde otomatik olarak yeni veriler çekilir.
  return (
    <AppContext.Provider
      value={{ ...state, removeStory, handleSearch, handlePage }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }