
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export function CustomTabBar({ state, descriptors, navigation }: Readonly<BottomTabBarProps>) {
    const translateX = useSharedValue(0);
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

    const tabWidth = dimensions.width / state.routes.length;

    useEffect(() => {
        if (tabWidth > 0) {
            translateX.value = withSpring(state.index * tabWidth, {
                damping: 30,
                stiffness: 150,
            });
        }
    }, [state.index, tabWidth]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const onLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        });
    };

    return (
        <View style={styles.container}>
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />

            <View style={styles.content} onLayout={onLayout}>
                {/* Botão flutuante verde */}
                {tabWidth > 0 && (
                    <Animated.View
                        style={[
                            styles.indicator,
                            { width: tabWidth },
                            animatedStyle,
                        ]}
                    >
                        <View style={styles.greenCircle} />
                    </Animated.View>
                )}

                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    // Icon
                    let iconName: keyof typeof Ionicons.glyphMap = 'alert-circle';
                    if (route.name === 'index') iconName = isFocused ? 'home' : 'home-outline';
                    else if (route.name === 'jogos-abertos') iconName = isFocused ? 'globe' : 'globe-outline';
                    else if (route.name === 'agendamentos') iconName = isFocused ? 'calendar' : 'calendar-outline';
                    else if (route.name === 'perfil') iconName = isFocused ? 'person' : 'person-outline';

                    // Label
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabItem}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={iconName}
                                size={20}
                                color={isFocused ? '#FFFFFF' : '#6B7280'}
                            />
                            <Text style={[
                                styles.label,
                                { color: '#6B7280' }
                            ]}>
                                {label as string}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        width: '90%',
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        zIndex: 2,
    },
    indicator: {
        position: 'absolute',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    greenCircle: {
        width: 50,
        height: 26,
        borderRadius: 15,
        backgroundColor: '#15A01A',
        marginBottom: 16,
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: '500',
    }
});
