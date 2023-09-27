import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreens from '../screens/HomeScreens';

const Drawer = createDrawerNavigator();

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator screenOptions={{
                headerShown: false,
            }}>
                <Drawer.Screen name="Home" component={HomeScreens} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}


export default AppNavigation;