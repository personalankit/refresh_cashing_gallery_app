import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, RefreshControl, StyleSheet } from "react-native";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline"
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s';

const HomeScreens = ({ navigation }) => {
    const [result, setResult] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchFromAPI = async () => {
            const cacheKey = 'apiData';
            try {
                const cachedData = await AsyncStorage.getItem(cacheKey);

                if (cachedData) {
                    processData(JSON.parse(cachedData));
                } else {
                    const response = await fetch(API_URL);
                    const data = await response.json();

                    await AsyncStorage.setItem(cacheKey, JSON.stringify(data));

                    processData(data);
                }
            } catch (error) {
                console.log("error", error);
            }
        }

        fetchFromAPI();
    }, []);

    function processData(data) {
        setResult(data.photos.photo);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await fetch(API_URL)
            const data = await response.json();

            await AsyncStorage.setItem('apiData', JSON.stringify(data));
            processData(data)
        } catch (error) {
            console.log("error", error);
        } finally {
            setRefreshing(false)
        }
    }


    return (
        <View className="bg-[#02201a] flex-1 p-2">
            <View className="p-4">
                <View className="flex-row items-center justify-center rounded-full border border-[#727272]">
                    <View className=" pl-5 flex-1 font-semibold text-gray-700">
                        <Text className="text-2xl text-white font-thin" style={styles.font}>The Gallery</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        className="rounded-full p-3 bg-[#fac422]">
                        <Bars3CenterLeftIcon size={25} strokeWidth={2} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className='px-4'>
                <View className="mt-4">
                    <Text className="text-5xl" style={styles.font}>
                        <Text className="text-gray-500">the best photos for /{' '}
                            <Text className="text-white">you</Text></Text>
                    </Text>
                </View>
            </View>

            <View className="flex-1 p-3">
                <FlatList
                    numColumns={2}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    showsVerticalScrollIndicator={false}
                    data={result}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <View className="w-[50%] justify-center items-center">
                                <Image
                                    source={{ uri: item.url_s }}
                                    className="h-[300] w-[160] mt-5 rounded-2xl"
                                    resizeMode="cover"
                                />
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
};

export default HomeScreens;

const styles = StyleSheet.create({
    font: {
        fontFamily: 'Vidaloka-Regular'
    }
})
