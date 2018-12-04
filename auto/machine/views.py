from django.shortcuts import render
from django.views import generic
from .models import *
import json
# Create your views here.

class IndexView(generic.TemplateView):
    template_name = 'machine/index.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['products'] = Product.objects.all()
        context['coins'] = Coin.objects.all()
        return context
    
    def post(self,request):
        print("Принято на сервере...")
        data = json.loads(request.body)
        print(data)
