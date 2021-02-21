import React from 'react';

export const users = {
    guest: {
        isLoggedIn: false,
        email: '',
        name: "Guest"
    }
}

export const UserContext = React.createContext({
    user: users.guest
});