from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
# from .populate import initiate  # uncomment if needed later
# Get an instance of a logger
logger = logging.getLogger(__name__)

# =============================================
# Create your views here.
# =============================================

@csrf_exempt
def login_user(request):
    """
    API endpoint for user login (POST only).
    Expects JSON body: {"username": "...", "password": "..."}
    Returns JSON with username and status.
    """
    if request.method != 'POST':
        return JsonResponse(
            {'error': 'Method not allowed. Use POST for login.'},
            status=405
        )

    try:
        data = json.loads(request.body)
        # Support both 'username' and 'userName' (common frontend variations)
        username = data.get('username') or data.get('userName')
        password = data.get('password')

        if not username or not password:
            return JsonResponse(
                {'error': 'Username and password are required'},
                status=400
            )

        # Authenticate the user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Successful login - create session
            login(request, user)
            response_data = {
                "username": user.username,  # use actual username from DB
                "status": True
            }
            logger.info(f"User {user.username} logged in successfully")
            return JsonResponse(response_data, status=200)
        else:
            # Authentication failed
            logger.warning(f"Failed login attempt for username: {username}")
            return JsonResponse(
                {
                    "username": username,
                    "status": "Failed",
                    "message": "Invalid credentials"
                },
                status=401
            )

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return JsonResponse({'error': 'Server error'}, status=500)


# Create a `logout_request` view to handle sign out request
# @csrf_exempt
# def logout_request(request):
#     # logout(request)
#     # return JsonResponse({"status": "Logged out"})
#     pass


# Create a `registration` view to handle sign up request
# @csrf_exempt
# def registration(request):
#     # Handle user registration (create user, etc.)
#     # return JsonResponse({...})
#     pass


# Update the `get_dealerships` view to render the index page with a list of dealerships
# def get_dealerships(request):
#     # dealerships = Dealer.objects.all()
#     # return render(request, 'djangoapp/index.html', {'dealerships': dealerships})
#     pass


# Create a `get_dealer_reviews` view to get reviews of a dealer
# def get_dealer_reviews(request, dealer_id):
#     # reviews = Review.objects.filter(dealer_id=dealer_id)
#     # return JsonResponse(...) or render(...)
#     pass


# Create a `get_dealer_details` view to get dealer details
# def get_dealer_details(request, dealer_id):
#     # dealer = Dealer.objects.get(id=dealer_id)
#     # return JsonResponse(...) or render(...)
#     pass


# Create a `add_review` view to submit a review
# @csrf_exempt
# def add_review(request):
#     # if request.method == 'POST':
#     #     ... save review ...
#     # return JsonResponse(...)
#     pass