function div(val, by){
    return (val - val % by) / by;
}

function sortNumber(a,b) {
    return b - a;
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
		this.bucketProducts =[];
		this.error = "";
	}
	//Методы удаления из массива
	removeObjById(array, id) {
	  let element = this.getMachineProductById(id);
	  const index = array.indexOf(element);
	  array.splice(index, 1);
	}

	renderPage()
	{
		
	}

	remove(array, id)
	{
		const index = array.indexOf(id);
		array.splice(index, 1);
	}

	canBuy()
	{
		if(this.price > this.getEnteredMoney())
		{
			this.error = "Вам не хватает денег!"
			console.log(this.error);
			return false
		}
		else if (this.price == 0)
		{
			this.error = "Товаров не выбрано..."
			console.log(this.error)
			return false
		}
		else if (true) 
		{
			console.log("Денег хватает, просчитываем сдачу");
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
		let delivery = this.getEnteredMoney() - this.price;
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
						return true;
					}
				}
			}
			else
			{
				this.remove(this.existingCoins,coin)
			}			

		});
		return false;		
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
		this.bucketProducts.push(id);
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
	setMachineProducts(id, amount, price)
	{
		for(let i =0; i < amount; i++)
		{
			this.machineProducts.push({"id":id, "price":price});
		}	
	}



	//Количество продуктов с определенным ID
	getAmountOfMachineProducts(id)
	{
		let amount = 0;

		this.machineProducts.forEach(function(item){
			if(item == id)
			{
				amount+=1;
			}
		});
		return amount;
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