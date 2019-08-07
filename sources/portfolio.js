
/* Регистрация компонентов Vue */
Vue.component('customers-table', {
	props: ['customers'],
	
	computed: {
		columns: function () {
			let columns = [];

			for (prop in this.customers[0]) {
				if(/Наи(б|мень)/.test(prop)) continue;

				column = {};

				column.data = prop;
				column.title = prop;

				if ([
					'Дата первой операции',
					'Дата последней операции',
					'Дата активации счета'
				].includes(prop)) {
					column.render = this.renderColumn;
				}
				
				columns.push(column)
			}

			return columns;
		},

		table: function() {
			return $(this.$el).children('table').DataTable({
				data: this.customers,
				paging: false,
				searching: true,
				scrollY: 600,
				scrollX: true,
				buttons: [
				   'copy', 'excel'
				],
				select: true,
				columns: this.columns,
				fixedHeader: false,
				colReorder: true
			});
		}
	},

	methods: {
		renderColumn: function (data, type, row) {
			if ((data) && (type === 'display' || type === 'filter')) {
				var d = new Date(data);
				return Intl.DateTimeFormat().format(d);
			}

			if (!data && (type === 'display' || type === 'filter')) {
				return 'Нет операций';
			}

			return data;
		},

		createColumnFilter: function() {
		    let header_row = this.table.columns().header()[0].parentNode;
		    let search_row = $('<tr></tr>');

		    let table = this.table
		    table.columns().flatten().each( colId => {

		    	let input = $(
		    	    	'<input type="text" placeholder="' +
		    			table.column(colId).header().innerHTML +
		    			'" /></td>')
			        .on('input', function () {
			            table.column( colId )
			                .search( $(this).val() )
			                .draw();
			        });

		    	$('<td></td>')
		    		.append(input)
		    	    .appendTo(search_row);
		    })

		    search_row.appendTo(header_row.parentNode);
		    this.table.draw();
		},


	},

	template: `
	<div>
		<table class="table table-striped"></table>
	</div>
	`
})

/* Создание основного экземпляра Vue */
let vm = new Vue({
	el: '#vue-body',
	data: {
		user: {
			realLogin: USER_LOGIN,
			portfolioLogin: USER_LOGIN,
			hasAccess: false,
			isSupervisor: false
		},
		zeppUrl: `http://zeppelin:81/v.bokun/customer_search/`,
		developerContacts: `\nНапиши автору: v.bokun@tinkoff.ru`,
		customers: {}
	},

	methods: {
		raiseError: function(text, error) {
			alert(
				text +
				this.developerContacts +
				(typeof error === 'undefined' ? '' : `\nОшибка: ` + error)
			);
		},

		getUser: async function() {
				
			let developers = ['v.bokun', 'd.e.motoriko', 'b.vasilyev'];
			let supervisors = ['y.klimikseeva', 'a.a.komissarova', 'e.petrova3', 'v.kulikov', 'v.borisenkova']

			if (developers.includes(this.user.realLogin)) {
				this.user.portfolioLogin = "a.voronkin";
			} else if (supervisors.includes(this.user.realLogin)) {
				// РГ могут выбрать, под каким сотрудником они заходят
			    this.user.portfolioLogin = prompt('Введи win-логин сотрудника:');
			    this.user.isSupervisor = true;
			} else {
				this.user.portfolioLogin = this.user.realLogin;
			}

			await fetch(`${this.zeppUrl}logins.json`)
		        .then(response => {
		    		return response.json();
		    	})
		        .then(
		        	validLoginsObj => {
			        	this.user.hasAccess = false;
				    
				    	for (validLoginId in validLoginsObj) {
							if(validLoginsObj[validLoginId] === this.user.portfolioLogin) {
								this.user.hasAccess = true;
								break;
							}
						}
					}, 
					error => {
		        		this.raiseError(`Не смогли получить данные о том, есть ли у тебя доступ.`, error)
		        		this.user.hasAccess = false;
		        	}
		        )
	    },

	    getCustomers: async function() {
	    	if (!this.user.hasAccess) {
				this.raiseError(`Для сотрудника ${login} нет данных.`);
				return;
			}

	    	await fetch(`${this.zeppUrl}${this.user.portfolioLogin}_customers.json`, {method: 'GET'})
			    .then(response => {
			    	return response.json();
			    })
			    .then(customers => {
			    	this.customers = customers;
			    })
	    }
	}
})


/* Основной скрипт */
$( document ).ready(
	vm.getUser()
		.then(() => {
			if(vm.user.hasAccess) {
				return vm.getCustomers();
			}
		})
		.then(() => {
			vm.$refs.customers_table.createColumnFilter();
		})
	)





