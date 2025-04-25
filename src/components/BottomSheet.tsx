import * as React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const {height: SCREEN_HEIGHT} = Dimensions.get('window')
const {width: SCREEN_WIDTH} = Dimensions.get('window')

type PropsBottomSheet = {
    children?: React.ReactNode
}

export type BottomSheetRefProps = {
    scrollTo: (destination:number) => void,
    isActive : () => boolean
}


const BottomSheet = React.forwardRef<BottomSheetRefProps, PropsBottomSheet>(({children}, ref) => {
    const translateY = useSharedValue(0)
    const context = useSharedValue({y: 0})
    const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50
    const active = useSharedValue(false)
    const [datas, setDatas] = React.useState<any>([]);

    // const getDatas = async () => {
    //     const res:any = await getData();
    //     // console.log(res[0])
    //     setDatas(res[0])
    // }

    // useFocusEffect(
    //     React.useCallback(() => {
    //         getDatas()
    //     }, [])
    // )

    const scrollTo = React.useCallback((destination:number) => {
        // console.log('destination', destination)
        'worklet';
        active.value = destination !== 0
        translateY.value = withSpring(destination, {damping: 50})
    }, [])

    const isActive = React.useCallback(() => {
        return active.value
    }, [])

    React.useImperativeHandle(ref, () => ({scrollTo, isActive}), [scrollTo, isActive])


    const gesture = Gesture.Pan()
    .onStart(() => {
        context.value = {y: translateY.value}
    })
    .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
    })
    .onEnd(() => {
        if(translateY.value > -SCREEN_HEIGHT / 3)
        {
            scrollTo(0)
        }
        else
        {
            scrollTo(MAX_TRANSLATE_Y)
        }
    })

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }]
        }
    })

    // React.useEffect(() => {
    //     scrollTo(-SCREEN_HEIGHT/3)
    // }, [])
  return (
    <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, rBottomSheetStyle]}>
            <View style={styles.line}></View>
            {children}
        </Animated.View>
    </GestureDetector>
  );
});

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width:'100%',
    backgroundColor:'#F5F5F5',
    // backgroundColor:'#efefef',
    position:'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    zIndex: 1000
  },
  line:{
    width: 75,
    height: 4,
    backgroundColor:'grey',
    borderRadius: 2,
    marginVertical: 15,
    alignSelf: 'center'
  }
});
