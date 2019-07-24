/* Основной скрипт */
let login;
let zepp_url = `http://zeppelin:81/v.bokun/customer_search/`;
let table_id = 'first_table';
let table;
let developer_contact = `\nНапиши автору: v.bokun@tinkoff.ru`

$(document).ready(
	() => {
		checkAccess()
			.then(checking_result => {
				if(checking_result.has_access) {
					$('#table_container').empty().append(`<table id="${table_id}"></table>`);
					drawTable(checking_result.login, table_id);			}
			});
	}
);

/* Функции, отвечающие за авторизацию */
function checkAccess() {
	let login;

	// Костыль на время дебага - для части юзеров прописываем чужой логин
	// Для РГ даем доступ к свободному выбору логина через
	
	if (['v.bokun', 'd.e.motoriko', 'b.vasilyev']
		.includes(USER_LOGIN)
		) {
		login = "a.voronkin";
	} else if (['y.klimikseeva', 'a.komissarova', 'e.petrova3', 'v.kulikov',]
		.includes(USER_LOGIN)
		) {
	    login = prompt('Введи win-логин сотрудника:')
	} else {
		login = USER_LOGIN;
	}


	let check_result = fetch(`${zepp_url}logins.json`, {method: 'GET'})
        .then(response => {
    		return response.json();
    	})
        .then(
        	valid_logins_obj => {
	        	let valid_logins = [];
		    
		    	for (valid_login in valid_logins_obj) {
					valid_logins.push(valid_logins_obj[valid_login]);
				}

		    	let has_access = valid_logins.includes(login);

		    	if (!has_access) {
					alert(
						`Для сотрудника ${login} нет данных.` +
						`\nУверен, что они должны быть, или логин вообще не твой -` +
						developer_contact
					);
				}

				return {
					login: login, 
					has_access: has_access
				};
			},

        	error => {
        		alert(
        			`Не смогли получить данные о том, есть ли у тебя доступ.` +
					developer_contact +
					`\nОшибка: ` + error
        		);

        		return {
        			login: login,
        			has_access: false
        		}
        	}
		);
    return check_result;
}

/* Функции, отвечающие за отрисовку таблицы */
function drawTable(login, table_id) {

	fetch(`${zepp_url}${login}_customers.json`, {method: 'GET'})
	    .then(response => {
	    	return response.json();
	    })
	    .then(
	    	customers => {
				let columns = getColumnsArray(customers);
				table = $(`#${table_id}`).DataTable({
					data: customers,
					paging: false,
					searching: true,
					scrollY: 600,
					scrollX: true,
					buttons: [
						   'copy', 'excel'
					],
					select: true,
					columns: columns,
					fixedHeader: false,
					colReorder: true
				});

				table = createColumnFilter(table);
				
			    // Отрисовываем кнопки
				$('#buttons').empty();

				table.buttons().container().appendTo($('#buttons'))
			},

			error => {
	    		alert(
	    			`Не смогли получить данные о твоем портфеле.` +
	    			developer_contact +
					`\nОшибка: ` + error
	    		);
	    	}
	    );
}

function createColumnFilter(table) {
    let header_row = table.columns().header()[0].parentNode;
    let search_row = $('<tr></tr>');

    table.columns().flatten().each( colId => {
    	let input = $(
    	    	'<input type="text" placeholder="' +
    			table.column(colId).header().innerHTML +
    			'" /></td>')
	        .on('input', function () {
	            table
	                .column( colId )
	                .search( $(this).val() )
	                .draw();
	        });

    	$('<td></td>')
    		.append(input)
    	    .appendTo(search_row);
    })

    search_row.appendTo(header_row.parentNode);
    table.draw();

    return table;
}

function getColumnsArray(customers) {
	let columns = [];

	for (prop in customers[0]) {
		if(/Наи(б|мень)/.test(prop)) continue;

		column = {};

		column.data = prop;
		column.title = prop;

		if ([
			'Дата первой операции',
			'Дата последней операции',
			'Дата активации счета'
		].includes(prop)) {
			column.render = renderColumn;
		}
		
		columns.push(column)
	}

	return columns;
}

function renderColumn(data, type, row) {
	if ((data) && (type === 'display' || type === 'filter')) {
		var d = new Date(data);
		return Intl.DateTimeFormat().format(d);
	}

	if (!data && (type === 'display' || type === 'filter')) {
		return 'Нет операций';
	}

	return data;
}