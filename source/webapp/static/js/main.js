const baseUrl = 'http://localhost:8000/api/v1/';

function getFullPath(path) {
    path = path.replace(/^\/+|\/+$/g, '');
    path = path.replace(/\/{2,}/g, '/');
    return baseUrl + path + '/';
}

function makeRequest(path, method, auth=true, data=null) {
    let settings = {
        url: getFullPath(path),
        method: method,
        dataType: 'json'
    };
    if (data) {
        settings['data'] = JSON.stringify(data);
        settings['contentType'] = 'application/json';
    }
    if (auth) {
        settings.headers = {'Authorization': 'Token ' + getToken()};
    }
    return $.ajax(settings);
}

function saveToken(token) {
    localStorage.setItem('authToken', token);
}

function getToken() {
    return localStorage.getItem('authToken');
}

function removeToken() {
    localStorage.removeItem('authToken');
}

function logIn(username, password) {
    const credentials = {username, password};
    let request = makeRequest('login', 'post', false, credentials);
    request.done(function(data, status, response) {
        console.log('Received token');
        saveToken(data.token);
        formModal.modal('hide');
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
        getQuotes()
    }).fail(function(response, status, message) {
        console.log('Could not get token');
        console.log(response.responseText);
    });
}

function logOut() {
    let request = makeRequest('logout', 'post', true);
    request.done(function(data, status, response) {
        console.log('Cleaned token');
        removeToken();
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
        getQuotes()
    }).fail(function(response, status, message) {
        console.log('Could not clean token');
        console.log(response.responseText);
    });
}

let logInForm, quoteForm, homeLink, enterLink, exitLink, formSubmit, formTitle, content, formModal,
    usernameInput, passwordInput, authorInput, textInput, emailInput, createLink, delete_q;

function setUpGlobalVars() {
    logInForm = $('#log_in_form');
    quoteForm = $('#quote_form');
    homeLink = $('#home_link');
    enterLink = $('#enter_link');
    exitLink = $('#exit_link');
    formSubmit = $('#form_submit');
    formTitle = $('#form_title');
    content = $('#content');
    formModal = $('#form_modal');
    usernameInput = $('#username_input');
    passwordInput = $('#password_input');
    authorInput = $('#author_input');
    textInput = $('#text_input');
    emailInput = $('#email_input');
    createLink = $('#create_link');
    delete_q = $('#delete_quote');
}

function setUpAuth() {
    logInForm.on('submit', function(event) {
        event.preventDefault();
        logIn(usernameInput.val(), passwordInput.val());
    });

    enterLink.on('click', function(event) {
        event.preventDefault();
        logInForm.removeClass('d-none');
        quoteForm.addClass('d-none');
        formTitle.text('Войти');
        formSubmit.text('Войти');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            logInForm.submit();
        });
    });

    exitLink.on('click', function(event) {
        event.preventDefault();
        logOut();
    });
}

function checkAuth() {
    let token = getToken();
    if(token) {
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
    } else {
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
    }
}

function rateUp(id) {
    let request = makeRequest('quotes/' +
        '' + id + '/rate_up', 'post', false);
    request.done(function(data, status, response) {
        console.log('Rated up quote with id ' + id + '.');
        $('#rating_' + id).text("Рейтинг цитаты: " + data.rating);
    }).fail(function(response, status, message) {
        console.log('Could not rate up quote with id ' + id + '.');
        console.log(response.responseText);
    });
}
function rateDown(id) {
    let request = makeRequest('quotes/' + id + '/rate_down', 'post', false);
    request.done(function(data, status, response) {
        console.log('Rated down quote with id ' + id + '.');
        $('#rating_' + id).text("Рейтинг цитаты: " + data.rating);
    }).fail(function(response, status, message) {
        console.log('Could not rate down quote with id ' + id + '.');
        console.log(response.responseText);
    });
}

function getQuotes() {
    let request  = makeRequest('quotes', 'get', false);
    let token = getToken();
    if (token) {
        request  = makeRequest('quotes', 'get', true);
    }
    request.done(function(data, status, response) {
        console.log(data);
        content.empty();
        data.forEach(function(item, index, array) {
            content.append($(`<div class="card mt-5" id="quote_${item.id}">
                <p class="mt-3">${item.text}</p>
                <p id="rating_${item.id}"> Рейтинг цитаты: ${item.raiting}</p>
                <p><a href="#" class="btn btn-success" id="rate_up_${item.id}">+</a></p>
                <p><a href="#" class="btn btn-danger" id="rate_down_${item.id}">-</a></p>
                <p>
                    <a href="#" class="btn btn-secondary"  data-toggle="modal" data-target="#form_modal" id="edit_quote">Редактировать</a>
                    <a href="#" class="btn btn-primary" id="delete_quote_${item.id}">Удалить цитату</a>
                </p>
            </div>`));
            $('#rate_up_' + item.id).on('click', function(event) {
                console.log('click');
                event.preventDefault();
                rateUp(item.id);
            });
            $('#rate_down_' + item.id).on('click', function(event) {
                console.log('click');
                event.preventDefault();
                rateDown(item.id);
            });
            $('#delete_quote_' + item.id).on('click', function(event) {
                console.log('click');
                event.preventDefault();
                deleteQuote(item.id);
            });
        });

    }).fail(function(response, status, message) {
        console.log('Could not get quotes.');
        console.log(response.responseText);
    });
}

function createForm() {
    createLink.on('submit', function(event) {
        event.preventDefault();
        createQuote(textInput.val(), authorInput.val(), emailInput.val());
    });

    createLink.on('click', function(event) {
        event.preventDefault();
        quoteForm.removeClass('d-none');
        logInForm.addClass('d-none');
        formTitle.text('Создать');
        formSubmit.text('Создать');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            createLink.submit();
        });
    });

    exitLink.on('click', function(event) {
        event.preventDefault();
        logOut();
    });
}

function createQuote(text, author, email) {
    const credentials = {text, author, email};
    let request = makeRequest('quotes', 'post', false, credentials);
    request.done(function(data, status, response) {
        console.log('Create quote');
        formModal.modal('hide');
    }).fail(function(response, status, message) {
        console.log('Could not create quote');
        console.log(response.responseText);
    });

}

function deleteQuote(id) {
    let request = makeRequest('quotes/' + id, 'delete', true,);
    request.done(function(data, status, response) {
        $('#quote_' + id).addClass('d-none');
        console.log('quote successfully deleted');
    }).fail(function(response, status, message) {
        console.log('Could not delete quote');
        console.log(response.responseText);
    });

}
$(document).ready(function() {
    setUpGlobalVars();
    setUpAuth();
    checkAuth();
    getQuotes();
    createForm()
});
