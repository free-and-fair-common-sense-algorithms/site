import $ from 'jquery'
import * as format from './formatters'
import { getMaxKey, getRandomInt, convertNum } from './utils'

// const self = this
const animateNumber = (startNum, endNum, selector, formatter) => {
    $({ num: startNum }).animate({ num: endNum }, {
        duration: 500,
        easing: 'linear',
        step: (num) => { selector.text(formatter(num)) },
        complete: () => { selector.text(formatter(endNum)) },
    })
}

const showModal = () => {
    $('#loading').modal('hide')
    $('#predictionModal').modal('show')
}

export default {
    bail_amount: (res) => {
        showModal()
        const text = getMaxKey(res)
        const value = res[text]
        const endNum = convertNum(text)
        const startNum = getRandomInt(500, 50000)
        const selector = $('#response-message-value')
        $('#response-message-value').text(format.dollar(startNum))
        $('#response-message-confidence').text(format.percent4(value))
        animateNumber(startNum, endNum, selector, format.dollar)
    },
    health_insurance_claim: (res) => {
        showModal()
        const text = getMaxKey(res)
        const value = res[text]
        const startNum = 0
        const endNum = convertNum(text) / 100
        const selector = $('#response-message-value')
        $('#response-message-value').text(format.percent2(startNum))
        $('#response-message-confidence').text(format.percent4(value))
        animateNumber(startNum, endNum, selector, format.percent2)
    },
    higher_education_grant: (res, num) => {
        showModal()
        const value = (Number(num) * res)
        const selector = $('#response-message-value')
        animateNumber(0, value, selector, format.dollar)
        $('#response-message-value').text(0)
        $('#response-label-confidence').parent().parent().hide()
    },
    error: (error) => {
        showModal()
        $('#response-label-value').html(`Error with prediction:<br>${error}`)
        $('#response-message-value').text('')
        $('#response-label-confidence').parent().parent().hide()
    },
}
