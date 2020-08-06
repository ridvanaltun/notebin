from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication


# parametre olarak verilen methodlara sadece admin user erişebilir demek
# db ile iletişim kuruluyor, admin kullanıcısı olduğu için db ile iletişimini önemsemedim
def only_admin(methods=[], err_message="Admin authorization required."):
    def decorator(view_function):
        def decorated_function(request, *args, **kwargs):
            # validate token existence
            if not 'Authorization' in request.headers:
                return Response({"detail": err_message}, status=status.HTTP_401_UNAUTHORIZED)

            # validate method
            capitalized_methods = [method.upper() for method in methods]
            is_method_ok = capitalized_methods == [] or request.method in capitalized_methods
            if is_method_ok:
                (user, token) = JWTAuthentication().authenticate(request)

                if user.is_staff:
                    return view_function(request, *args, **kwargs)
                else:
                    return Response({"detail": err_message}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return view_function(request, *args, **kwargs)

        return decorated_function
    return decorator


# parametre olarak verilen methodlara sadece id bilgisi tutan user ve admin erişebilir
def id_verified(methods=[], jwt_key="user_id", admin_jwt_key="is_staff", err_message="Authorization has been denied for this request."):
    def decorator(view_function):
        def decorated_function(request, id, *args, **kwargs):
            # validate token existence
            if not 'Authorization' in request.headers:
                return Response({"detail": err_message}, status=status.HTTP_401_UNAUTHORIZED)

            # validate method
            capitalized_methods = [method.upper() for method in methods]
            is_method_ok = capitalized_methods == [] or request.method in capitalized_methods
            if is_method_ok:
                auth = JWTAuthentication()
                header = auth.get_header(request)
                raw_token = auth.get_raw_token(header)
                validated_token = auth.get_validated_token(raw_token)
                is_admin = validated_token.get(admin_jwt_key, default=False)
                jwt_id = validated_token.get(jwt_key, default=False)

                if id == jwt_id or is_admin:
                    return view_function(request, id, *args, **kwargs)
                else:
                    return Response({"detail": err_message}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return view_function(request, id, *args, **kwargs)

        return decorated_function
    return decorator


# ilgili fonksiyona sadece jwt token'ı geçerli olan tüm user'lar erişebilir
def is_authenticated(view_function):
    def decorated_function(request, *args, **kwargs):
        # validate token existence
        if not 'Authorization' in request.headers:
            return Response({"detail": "Authorization required."}, status=status.HTTP_401_UNAUTHORIZED)

        # token tarihi geçmişse yada yanlış yazılmışsa otomatik olarak hata üretiyor, else'e girmiyor
        auth = JWTAuthentication()
        header = auth.get_header(request)
        raw_token = auth.get_raw_token(header)
        validated_token = auth.get_validated_token(raw_token)

        if validated_token:
            return view_function(request, *args, **kwargs)
        else:
            # token verilmemişse buraya düşüyor
            return Response({"detail": "Authorization required."}, status=status.HTTP_401_UNAUTHORIZED)

    return decorated_function
