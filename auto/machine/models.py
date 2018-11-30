from django.db import models

# Create your models here.

class SodaMachine(models.Model):
    name = models.CharField(max_length = 100)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length= 100)
    description = models.CharField(max_length= 1000)
    pic = models.CharField(max_length= 2500)
    cost = models.IntegerField()
    amount = models.IntegerField(default= 5)
    sodaMachine = models.ForeignKey(SodaMachine, on_delete=models.CASCADE)

    def __str__(self):
        return '%s - %s руб. x%s' %(self.name, str(self.cost), str(self.amount))

class Value(models.Model):
    val = models.IntegerField()

    def __str__(self):
        return str(self.val)

class Coin(models.Model):
    name = models.CharField(max_length = 100)
    amount = models.IntegerField()
    value = models.ForeignKey(Value, on_delete=models.CASCADE)
    sodaMachine = models.ForeignKey(SodaMachine, on_delete=models.CASCADE)

    def __str__(self):
        return '%s x%s' %(self.name, str(self.amount))
