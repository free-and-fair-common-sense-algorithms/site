import $ from 'jquery'
import * as format from './formatters'
import { getMaxKey, getRandomInt, convertNum } from './utils'

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
        $('#api-error').remove()
        $('#response-label-value').show()
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
        $('#api-error').remove()
        $('#response-label-value').show()
        $('#response-message-value').text(format.percent2(startNum))
        $('#response-message-confidence').text(format.percent4(value))
        animateNumber(startNum, endNum, selector, format.percent2)
    },
    higher_education_grant: (res, num) => {
        showModal()
        const value = (Number(num) * res)
        const selector = $('#response-message-value')
        animateNumber(0, value, selector, format.dollar)
        $('#api-error').remove()
        $('#response-label-value').show()
        $('#response-message-value').text(0)
        $('#response-label-confidence').parent().parent().hide()
    },
    error: (error) => {
        showModal()
        $('#response-label-value').hide()
        $('#api-error').remove()
        $('#response').append('<div id="api-error"><h4>There was an error with the calculation.</h4>')
        console.error(`Error with prediction: ${error} \nFile an issue here if this persists: https://github.com/free-and-fair-common-sense-algorithms/site/issues/new?body=%0A%0A[describe your issue here]%0A---%0AError:\`${error}\``)
        $('#response-message-value').text('')
        $('#response-label-confidence').parent().parent().hide()
    },
}
