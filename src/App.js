import React, {useEffect, useState} from 'react'
import './App.css'
import CurrencyRow from './CurrencyRow'

const URL = 'https://v6.exchangerate-api.com/v6/ad1c6ea46d098ebb389d84ee/latest/USD'

export default function App() {

  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency , setFromCurrency] = useState()
  const [toCurrency, setToCurrency]  = useState()
  const [exchangerate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [changedAmount, setChangedAmount] = useState(true)
  // const [currencyData_Array, setCurrencyData_Array] = useState([])

  let toAmount , fromAmount
  if (changedAmount) {
    fromAmount = amount
    toAmount = amount * exchangerate
  } else {
    toAmount = amount
    fromAmount = amount / exchangerate
  }

  useEffect( () => {
    fetch(URL)
    .then(res => res.json())
    .then(data => {
      // setCurrencyData_Array(data)
      const firstCurrency = Object.keys(data.conversion_rates)[1]
      setCurrencyOptions([...Object.keys(data.conversion_rates)])
      setFromCurrency(data.base_code)
      setToCurrency(firstCurrency)
      setExchangeRate(data.conversion_rates[firstCurrency])
    })
  }, [])

  useEffect(() => {
    if (fromCurrency != null) 
    {
      fetch(URL)
        .then(res => res.json())
        .then(data => setExchangeRate(data.conversion_rates[fromCurrency]))
    }
  }, [fromCurrency])
  
  useEffect(() => {
    if (toCurrency != null) 
    {
      fetch(URL)
        .then(res => res.json())
        .then(data => setExchangeRate(data.conversion_rates[toCurrency]))
    }
  }, [toCurrency])

  function handle_from_amount(e) {
    setAmount(e.target.value)
    setChangedAmount(true)
  }

  function handle_to_amount(e) {
    setAmount(e.target.value)
    setChangedAmount(false)
  }

  return (
    <>
      <div className='container'>
        <h1>Convert</h1>
        <CurrencyRow
          currencyOptions = {currencyOptions}
          selectedCurrency = {fromCurrency}
          onChangeCurrency = {e => setFromCurrency(e.target.value)}
          amount = {fromAmount}
          handleChange = {handle_from_amount}
         />

        <div className='equals'>=</div>

        <CurrencyRow 
            currencyOptions = {currencyOptions}
            selectedCurrency = {toCurrency}
            onChangeCurrency = {e => setToCurrency(e.target.value)}
            amount = {toAmount}
            handleChange = {handle_to_amount}
        />
      </div>
    </>
  )
}

