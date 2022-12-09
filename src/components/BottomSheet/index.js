import React, {useEffect, useRef,} from 'react';
import {Animated, Dimensions,FlatList, PanResponder, Platform, StyleSheet, View, Text, Alert, TouchableOpacity, StatusBar} from 'react-native';
import { HEIGHT, WIDTH } from '../../utility';

const DRAG_THRESHOLD = 50;

const BottomSheet = ({
    visible,
    handlePressImage,
    bottomSheetMaxHeight,
    bottomSheetMinHeight,
    props
}) => {
    const MAX_UPWARD_TRANSLATE_Y =(Dimensions.get('screen').height==Dimensions.get('window').height)?
     bottomSheetMinHeight - bottomSheetMaxHeight + StatusBar.currentHeight
     : bottomSheetMinHeight - bottomSheetMaxHeight;
    const MAX_DOWNWARD_TRANSLATE_Y = 0;
    useEffect(() => {
        if(!visible) {
            springAnimation(0)
        }
    },[visible])

    const animatedValue = useRef(new Animated.Value(0)).current;
    const lastGestureDy = useRef(0);
    const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedValue.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (e, gesture) => {
        animatedValue.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValue.flattenOffset();
        lastGestureDy.current += gesture.dy;

        // lastGestureDy.current > 0 => close bottom sheet

        if( lastGestureDy.current > 0) {
            handlePressImage();
        }
        if (gesture.dy > 0) {
          // dragging down
          if (gesture.dy <= DRAG_THRESHOLD) {
            springAnimation(MAX_UPWARD_TRANSLATE_Y);
          } else {
            springAnimation( MAX_DOWNWARD_TRANSLATE_Y);
          }
        } else {
          // dragging up
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation(MAX_DOWNWARD_TRANSLATE_Y);
          } else {
            springAnimation(MAX_UPWARD_TRANSLATE_Y);
          }
        }
      },
    }),
  ).current;

  const springAnimation = (value) => {
    lastGestureDy.current = value
    Animated.timing(animatedValue, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start();
  };

  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
  return (
    <View style={styles.container}>
      {
        visible? 
        (<Animated.View style={[styles.bottomSheet, bottomSheetAnimation]}>
            <View style={styles.draggableArea} {...panResponder.panHandlers}>
              <View style={styles.dragHandle} />
            </View>
            {props}
          </Animated.View>) :
          <></>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    width: '100%',
    height: HEIGHT,
    elevation:15,
    backgroundColor: 'white',
  },
  draggableArea: {
    width: WIDTH,
    height: HEIGHT*0.05,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    width: WIDTH*0.2,
    height: HEIGHT*0.005,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
  },
});

export default BottomSheet