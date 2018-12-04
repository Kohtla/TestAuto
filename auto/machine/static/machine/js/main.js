function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function div(val, by){
    return (val - val % by) / by;
}

function sortNumber(a,b) {
    return b - a;
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

class PageData
{
	constructor()
	{
		this.enteredMoney = [];
		this.machineMoney = [];
		this.returnMoney = [];
		this.machineProducts = [];
		this.existingCoins = [];
		this.price = 0;
		this.delivery = 0;
		this.bucketProducts =[];
		this.error = "";
	}


	send(url)
	{
		//let csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
		let csrftoken = getCookie('csrftoken');
		console.log(csrftoken);
		$.ajaxSetup({
				beforeSend: function(xhr, settings) {
		        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
		            xhr.setRequestHeader("X-CSRFToken", csrftoken);
		        }
		    }
		    
		});
		$.ajax({
			type: 'POST',
			url: url,
			data: {products: this.bucketProducts},
			success: function(){
				console.log(this.bucketProducts);
			}
		});
	}
	//Методы удаления из массива
	removeObjById(array, id) {
	  let element = this.getMachineProductById(id);
	  const index = array.indexOf(element);
	  array.splice(index, 1);
	}

	existDelivery(array, val)
	{
		let flag = false;
		array.forEach(item =>{
			if(item.id == val.id)
			{
				//console.log(item.id, val.id)
				flag = true
			}
		});
		return flag;
	}

	addDelivery(array, val)
	{
		array.forEach(item=>{
			if(item.id == val.id)
			{
				item.amount += 1;
			}
		});
	}

	//Достать массив сдачи
	getDeliveryArray()
	{
		
		let retArr = []; 
		this.returnMoney.forEach(item=>{

			let obj = {"id": item, "amount":1};
			//console.log(this.existDelivery(retArr,obj))
			if(!this.existDelivery(retArr,obj))
			{
				retArr.push(obj);
			}
			else
			{
				this.addDelivery(retArr, obj);
			}
		});
		//console.log(retArr);
		return retArr;
	}

	renderPage()
	{
		//console.log(this.canBuy());
		if(this.canBuy())
		{
			$("#buy").prop( "disabled", false);
			$("#delivery").html("Сдача: "+this.delivery+" руб");
		}
		else
		{
			this.returnMoney = [];
			$("#delivery").html(this.error);
			$("#deliveryBlock").html('');
		}
		
		$("#allMoney").html(this.getEnteredMoney());
		
		$("#price").html(this.price);

		this.machineProducts.forEach(prod=>{
			let am = this.getAmountOfMachineProducts(prod.id);
			if(am == 0)
			{
				$("#prod-"+prod.id).prop("disabled", true);
			}
			//console.log("#amount-"+prod.id, am);
			$("#amount-"+prod.id).html(am);
		});

		let bucketListContent = "";

		this.bucketProducts.forEach(prod=>{
			bucketListContent += '<a href="#" class="list-group-item list-group-item-action">' + prod.name+' - '+prod.price+ ' руб.</a>';
			//console.log(prod.name, prod.price);
		});
		$("#bucketList").html(bucketListContent);

		let deliveryBlockContent = "";
		let arr = this.getDeliveryArray();
		arr.forEach(item=>{

			deliveryBlockContent += '<p><span class="badge badge-primary">'+item.id+' руб. - x'+ item.amount+'</span></p>';

		});
		$("#deliveryBlock").html(deliveryBlockContent);


	}

	remove(array, id)
	{
		const index = array.indexOf(id);
		array.splice(index, 1);
	}

	canBuy()
	{
		this.returnMoney.forEach(item=>{
			this.machineMoney.push(item);
		});
		this.returnMoney = [];
		let flag = false;
		if(this.price > this.getEnteredMoney())
		{
			this.error = "Вам не хватает денег..."
			console.log(this.error);
			return flag;
		}
		else if (this.price == 0)
		{
			this.error = "Товар не выбран..."
			console.log(this.error)
			return flag;
		}
		else if (this.price == this.getEnteredMoney() && this.price > 0)
		{
			this.error = "Денег хватает, сдача не нужна..."
			flag = true;
			return flag
		}
		else if (true) 
		{
			console.log("Денег хватает, просчитываем сдачу...");
			return this.predictReturnMoney();
		}

	}

	//Есть ли монетка в машине
	isThereACoin(array, value)
	{
		let flag = false;
		array.forEach(function(coin){
			if(coin == value)
			{
				flag = true;
			}
		});
		return flag;
	}

	theBiggestCoin(array)
	{
		let value = 0;
		array.forEach(function(item){
			if(item > value)
			{
				value = item
			}
		});
		return value;
	}


	predictReturnMoney()
	{
		let flag = false;
		let delivery = this.getEnteredMoney() - this.price;
		this.delivery = delivery;
		console.log("Сдача: "+delivery);

		this.existingCoins.sort(sortNumber);

		this.existingCoins.forEach(coin =>{			
			if(this.isThereACoin(this.machineMoney,coin))
			{
				while(div(delivery,coin)>0)
				{
					delivery -= coin;
					this.returnCoin(coin);
					if(delivery == 0)
					{
						console.log("Сдача подобрана...");
						console.log(this.returnMoney);						
						flag = true;
					}
				}
			}
			else
			{
				this.remove(this.existingCoins,coin)
			}			

		});
		return flag;		
	}

	//

	//Возвращает объект по id
	getMachineProductById(id)
	{
		let retobj = null
		this.machineProducts.forEach(function(item){
			if(item.id == id)
			{
				retobj =item;
			}
		});
		return retobj;
	}
	//Метод добавления монетки
	addCoin(value)
	{
		this.enteredMoney.push(value);
		this.machineMoney.push(value);				
	}
	//Метод добавления монетки в сдачу
	returnCoin(value)
	{
		this.remove(this.machineMoney,value)
		this.returnMoney.push(value);				
	}
	//Добавление продукта в корзину
	addProductToBucket(id)
	{
		let item = this.getMachineProductById(id)
		this.removeObjById(this.machineProducts, id);
		item.amount -= 1;
		this.machineProducts.push(item);
		this.bucketProducts.push(item);
		this.price += item.price;		
	}

	//Чтение количества монет в базе данных
	setMachineCoins(value, amount)
	{
		for(let i =0; i < amount; i++)
		{
			this.machineMoney.push(value);
		}	
		//alert(this.machineMoney);	
	}

	//Чтение видов монет
	setExistingCoins(value)
	{
		this.existingCoins.push(value);
	}

	//Чтение количества продуктов в базе данных
	setMachineProducts(id, name, amount, price)
	{
		this.machineProducts.push({"id":id, "name":name, "amount":amount, "price":price});	
	}



	//Количество продуктов с определенным ID
	getAmountOfMachineProducts(id)
	{
		return this.getMachineProductById(id).amount;
	}

	//Внесенная сумма
	getEnteredMoney()
	{
		let sum = 0;

		this.enteredMoney.forEach(function(item){
			sum += item;
		});

		return sum;
	}

	//Количество монет определенного достоинства, внесенных пользователем
	getAmountOfEnteredCoins(value)
	{
		let amount = 0;

		this.enteredMoney.forEach(function(item){
			if(item == value)
			{
				amount+=1;
			}
		});
		return amount;
	}

	//Количество монет определенного достоинства, находящихся в машине
	getAmountOfMachineCoins(value)
	{
		let amount = 0;

		this.machineMoney.forEach(function(item){
			if(item == value)
			{
				amount+=1;
			}
		});

		return amount;
	}

}