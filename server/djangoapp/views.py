from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate

# Get an instance of a logger
logger = logging.getLogger(__name__)

# =============================================
# Create your views here.
# =============================================

@csrf_exempt
def login_user(request):

    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get('userName') or data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            
            login(request, user)
            # SUCCESS: React needs "userName" and "Authenticated"
            return JsonResponse({"userName": username, "status": "Authenticated"})
        else:
            # FAILURE: React needs this to show 'Invalid Credentials'
            return JsonResponse({
                "userName": username, 
                "status": "Failed", 
                "message": "Invalid credentials"
            })
    except Exception as e:
        return JsonResponse({"status": "Error", "message": str(e)}, status=500)

@csrf_exempt
def logout_request(request):
    logout(request)
    return JsonResponse({"userName": ""})

@csrf_exempt
def registration(request):
    try:
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
    
        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Already Registered"})

        user = User.objects.create_user(
            username=username, 
            first_name=first_name, 
            last_name=last_name, 
            password=password, 
            email=email
        )

        login(request, user)
        return JsonResponse({"status": "Authenticated", "userName": username})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def get_dealerships(request):
    if request.method == "GET":
        # In the next part of the lab, you will use a helper function 
        # to fetch real data from the backend service.
        # For now, we return an empty list or mock data.
        return JsonResponse({"status": 200, "dealers": []})

