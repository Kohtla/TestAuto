class PageData
{
	constructor()
	{
		this.enteredMoney = [];
		this.machineMoney = [];
		this.returnMoney = [];
		this.bucketProducts =[];
	}

	addCoin(value)
	{
		this.enteredMoney.push(value);
		this.machineMoney.push(value);				
	}

	setMachineCoin(value)
	{
		for(let i =0; i < value; i++)
		{
			this.machineMoney.push(value);
		}		
	}

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


	getEnteredMoney()
	{
		let sum = 0;

		this.enteredMoney.forEach(function(item){
			sum += item;
		});

		return sum;
	}
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

}