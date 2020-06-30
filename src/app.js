import '@/assets/css/app.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import $ from 'jquery'
import * as handlers from './handlers'
import { format } from './utils'
import logoSource from './assets/images/logo.svg'
import logoImageSource from './assets/images/logo_image.svg'

const env = process.env.NODE_ENV || 'development'
window.jQuery = $
window.$ = $

// -- IMAGES ----------------------------------------------
$('#logo').html(logoSource)
$('#logo-nav').html(logoSource)
$('#logo_image').html(logoImageSource)

// -- FORM HANDLING ---------------------------------------

const BASE_URL = env === 'development' ? 'http://localhost:5000/' : 'https://api.free-and-fair-common-sense-algorithms-for-society.org/'

const shuffleOptions = () => {
    $('select').each((_, e) => {
        const optionElements = $(e).children('option')
        const randomOption = Math.floor(Math.random() * optionElements.length)
        $(optionElements[randomOption]).attr('selected', true).fadeIn(100)
    })
}

const getFormData = () => {
    const form = new FormData(document.querySelector('form'))
    return Object.fromEntries(Array.from(form, e => [format(e[0]), format(e[1])]))
}

const submitForm = () => {
    $('#submit-btn').click(() => {
        $('#algorithm-form').submit((event) => {
            event.preventDefault()
            event.stopImmediatePropagation()
            $('#loading').modal('show')
            const algorithmName = $('#algorithm-form').attr('data-algorithm-name')
            const endpoint = algorithmName.replace(/_/g, '-')
            const data = getFormData()
            const settings = {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(data),
            }
            fetch(`${BASE_URL}${endpoint}`, settings)
                .then(response => response.json())
                .then(res => handlers.default[algorithmName](res, data.num))
                .catch(error => handlers.default.error(error))
        })
    })
}

const createNumberForm = (minNum, maxNum, placeholder) => {
    return `
    <fieldset class="form-group">
        <div class="row">
            <legend class="col-form-label col-sm-3">Tuition Amount ($)</legend>
            <div class="col-sm-9">
              <input type="number" min="${minNum}" max="${maxNum}" value="${placeholder}" class="form-control" id="num" name="num" placeholder=${placeholder}>
            </div>
        </div>
    </fieldset>`
}

const addTextForm = () => {
    const algorithmName = $('#algorithm-form').attr('data-algorithm-name')
    if (algorithmName === 'higher_education_grant') {
        const numberForm = createNumberForm(10, 100000, 1000)
        $(numberForm).insertBefore('#submit-btn')
    }
}

$(document).ready(() => {
    addTextForm()
    submitForm()
    shuffleOptions()
})
