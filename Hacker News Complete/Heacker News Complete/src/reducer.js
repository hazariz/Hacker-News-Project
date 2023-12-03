import {
    SET_LOADING,
    SET_STORIES,
    REMOVE_STORY,
    HANDLE_PAGE,
    HANDLE_SEARCH,
  } from './actions'
  
  const reducer = (state, action) => {
    switch (action.type) {
      case SET_LOADING:
        return { ...state, isLoading: true }
      case SET_STORIES:
        return {
          ...state,
          isLoading: false,
          hits: action.payload.hits,
          nbPages: action.payload.nbPages,
        }
      case REMOVE_STORY:
        return {
          ...state,
          hits: state.hits.filter((story) => story.objectID !== action.payload),
        }
      case HANDLE_SEARCH:
        // eğer action tipi hsndle searc ise durumu koplauarak query ve page özelliklerini actionun payloduna göre günceller pagei 0 olarak ayarlar.
        return { ...state, query: action.payload, page: 0 }
      case HANDLE_PAGE:
        // Eğer action'ın tipi HANDLE_PAGE ise, action'ın payload'ına ('inc' veya 'dec' veya bir sayı) bağlı olarak page özelliğini günceller. Sayfa arttırma ('inc') veya azaltma ('dec') durumları için ek kontroller eklenmiştir.
        if (action.payload === 'inc') {
          let nextPage = state.page + 1
          if (nextPage > state.nbPages - 1) {
            nextPage = 0
          }
          return { ...state, page: nextPage }
        }
        if (action.payload === 'dec') {
          let prevPage = state.page - 1
          if (prevPage < 0) {
            prevPage = state.nbPages - 1
          }
          return { ...state, page: prevPage }
        }
        return { ...state, page: action.payload }  
        default:
          throw new Error(`no mathching "${action.type}" action type`)
    }
  }
  export default reducer
  // export default reducer ifadesiyle, bu reducer fonksiyonu diğer dosyalardan kullanılmak üzere dışa aktarılır.