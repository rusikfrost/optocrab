
const vue = new Vue({
	el: 'main',
	data: {
	  	opened: [],
	  	rows: [],
	  	sum_full_price: 0,
	  	double_rows: [],
	  	go_home: false,
	  	hidden_go_home: true,
	  	admin_open: false,
	  	hidden_admin: true,
	  	admin: {login: '', password: ''},
	  	formcomment: []
  },
	  methods: {
	  	toggle(id) {
	    	const index = this.opened.indexOf(id);
	    	if (index > -1) {
		    	this.opened.splice(index, 1)
	    	} else {
		      	this.opened = [];
		      	this.opened.push(id)
	    	}
	    },
	    toggle_go_home: function(){
	    	this.go_home = true;
	    },
	    input_number: function(id){
	    	if (this.rows[id].count > 0){
		    	this.rows[id].sum_price = this.rows[id].count * this.rows[id].price * this.rows[id].kg_in_pack;
		    	this.rows[id].kg = this.rows[id].count * this.rows[id].kg_in_pack;
		    	full_price(this.rows[id].id)
	    	}
	    },
	    minus: function(id) {
	    	if (this.rows[id].count > 0){
		    	this.rows[id].count = this.rows[id].count - 1;
		    	this.rows[id].sum_price = this.rows[id].sum_price - this.rows[id].price * this.rows[id].kg_in_pack;
		    	this.rows[id].kg = this.rows[id].kg - this.rows[id].kg_in_pack;
		    	full_price(this.rows[id].id)
	    	}
	    },
	    plus: function(id) {
	    		this.rows[id].count = Number(this.rows[id].count);
		    	this.rows[id].count = this.rows[id].count + 1;
		    	this.rows[id].sum_price = this.rows[id].count * this.rows[id].price * this.rows[id].kg_in_pack;
		    	this.rows[id].kg = this.rows[id].count * this.rows[id].kg_in_pack;
		    	full_price(this.rows[id].id, this.rows[id].name, this.rows[id].id,)
	    	},
	    admin_send: function() {
	    		axios.post('/admin', {
			    	login: this.admin.login,
			    	password: this.admin.password
			    })
	   		},
	  	},
	  	mounted() {
	    axios.post('/products')
	        .then(function (response) {
	    console.log(response.data);
	    vue.rows = response.data;
	  })
  }
});

function full_price(f){
	vue.double_rows = vue.rows.slice();
	var arr = vue.double_rows;

	arr.reduce(function (a, b) {
		if (arr[0].id === 0){
			arr.splice(0, 1);
	  		return {sum_price: a.sum_price + b.sum_price};
		} else {
			return {sum_price: a.sum_price + b.sum_price};
		}	
	})
	console.log(arr.reduce((a, b) => ({sum_price: a.sum_price + b.sum_price})));
	var spr = arr.reduce((a, b) => ({sum_price: a.sum_price + b.sum_price}));
	vue.sum_full_price = spr.sum_price;
	vue.submit_button_value = 'Оплатить '+spr.sum_price+' рублей';

vue.formcomment = [];
}

function formcomment_fun() {
	i=1;
while (i < vue.rows.length) {
	var formcomment_arry = vue.rows[i].kg + 'kg ' + vue.rows[i].name + ' - ' + vue.rows[i].count + ' упаковок на' + vue.rows[i].sum_price + 'рублей' 
 	vue.formcomment.push(formcomment_arry);
  i++;
}
}

function y_val(yv) {
	document.getElementById("val").value = yv + ".00";
}

