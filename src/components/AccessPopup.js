import axios from 'axios'
import { useEffect, useState } from 'react'
import { X, ArrowRight, Check, ChevronDown, ChevronUp } from 'react-feather'

// const PERSONAL_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export default function AccessPopup(props) {

  const { isOpen, closePopup, openAIKey, saveOpenAIKey } = props

  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState('')

  const validateApiKey = () => {
    if (apiKeyInput.trim() === '') {
      return false
    }
    let apiKeyToUse = apiKeyInput
    // if (apiKeyInput.toLowerCase() === 'keralaph') {
    //   apiKeyToUse = PERSONAL_API_KEY
    // }
    setIsValidating(true)
    axios.get('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': 'Bearer ' + apiKeyToUse
      }
    })
    .then(res => {
      if (res.status === 200) {
        closePopup()
        saveOpenAIKey(apiKeyToUse)
        setIsValidating(false)
      }
    })
  }

  useEffect(() => {
    if (openAIKey) {
      setApiKeyInput(openAIKey)
    }
  }, [openAIKey])

  return (
    <>
      <div className={`popup-container ${isOpen ? '' : 'hidden'}`}>
        <div 
          className='blur-bg'
          onClick={closePopup} />

        <div className='popup-card'>
          <div className='header'>
            <span className='title-text'>
              { openAIKey ? 'Update access to ChatGPT' : 'Setup access to ChatGPT'}
            </span>
            <X 
              className='close-icon'
              onClick={closePopup} />
          </div>
          <div className='card-content'>
            <div className='text-holder'>
              <span className='title-text'>Your OpenAI API Key</span>
              <span className='subtitle-text'>Your API Key will stay locally on your browser and is not shared elsewhere.</span>
              <a style={{alignSelf: 'flex-start'}}
                href='https://platform.openai.com/account/api-keys' target='_blank'>
                <button className='get-key-btn'>
                  <span className='label'>Get your API key from OpenAI's Dashboard</span>
                  <ArrowRight className='icon' strokeWidth={3} />
                </button>
              </a>
              <div className='notes-holder'>
                <span 
                  className={`section-title ${isNotesOpen ? 'open' : ''}`}
                  onClick={() => setIsNotesOpen(!isNotesOpen)} >
                  <span>Things to note</span>
                  { isNotesOpen ? <ChevronUp className='dropdown-icon' strokeWidth={3} /> : <ChevronDown className='dropdown-icon' strokeWidth={3} /> }
                </span>
                <ul className={`note-points ${isNotesOpen ? '' : 'hidden'}`}>
                  <li>To use OpenAI's API key, you need to add your billing information in <a href='https://platform.openai.com/account/billing/overview' target='_blank'>OpenAI's Billing</a> settings. Without this, your API key won't work.</li>
                  <li>Using OpenAI's ChatGPT API key is very affordable. You only pay for what you use, and it <a href='https://openai.com/pricing#language-models'>costs</a> roughly <b>$1</b> to process <b>100,000 words</b>.</li>
                  <li>You don't need a ChatGPT Plus Subscription to use the API.</li>
                </ul>
              </div>
            </div>
            <div className='input-holder'>
              <input 
                className='key-input'
                spellCheck={false}
                disabled={isValidating}
                value={apiKeyInput}
                onInput={(e) => setApiKeyInput(e.target.value)}
                placeholder='sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' />
              <button 
                className='save-btn'
                onClick={validateApiKey}>
                {
                  isValidating ? (
                    <div className="querie-spinner" style={{margin: '1px 0 2px 0'}} />
                  ) : (
                    <>
                      <Check className='check-icon' strokeWidth={3} />
                      <span>{openAIKey ? 'Change API Key' : 'Save API Key'}</span>
                    </>
                  )
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
