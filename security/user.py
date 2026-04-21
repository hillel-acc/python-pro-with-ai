from pydantic import BaseModel

import bcrypt


def hash_passwd(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt)


fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": hash_passwd("fakehashedsecret"),
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": hash_passwd("fakehashedsecret2"),
        "disabled": True,
    },
}


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


def get_user(username: str):
    user_dict = fake_users_db[username]
    return User(**user_dict), user_dict["hashed_password"]
