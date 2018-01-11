// export const showMessage = (showToast, message, messageType = 'success') => ({
//   type : 'SHOW_MESSAGEBAR',
//   payload : { showToast, message, messageType }
// })

export const showSpinner = payload => ({ type : 'SHOW_SPINNER', payload })

export default {
  // showMessage,
  showSpinner
}