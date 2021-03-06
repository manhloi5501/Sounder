import React, {createRef} from 'react';
import {useRef} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {Animated, FlatList, StyleSheet, Keyboard, Alert} from 'react-native';
import {View, Text} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import rootColor from '../constants/colors';
import dimensions, {authFormDimensions, spacing} from '../constants/dimensions';
import {rootFonts} from '../constants/fonts';
import Dots from './Dots';
import MyTextInput from './MyTextInput';
import PrimaryBtn from './PrimaryBtn';
import AntDesign from 'react-native-vector-icons/AntDesign';
import rootApi from '../api';
import {useDispatch} from 'react-redux';
import {login} from '../redux/actions/userActions';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {showAlertAction} from '../redux/actions/alertActions';

const formField = [
  {
    label: 'Tên',
    value: (text: string) => text,
    setValue: (callback: void) => callback,
    type: 'name',
    config: {
      placeholder: 'Tên của bạn là',
      isFocus: true,
    },
    leftIcon: <AntDesign name="meh" color={rootColor.whiteColor} size={20} />,
  },
  {
    label: 'Email',
    value: (text: string) => text,
    setValue: (callback: void) => callback,
    type: 'email',

    config: {
      placeholder: 'Địa chỉ Email',
    },
    leftIcon: <AntDesign name="user" color={rootColor.whiteColor} size={20} />,
  },
  {
    label: 'Mật khẩu',
    value: (text: string) => text,
    setValue: (callback: void) => callback,
    type: 'password',
    config: {
      placeholder: 'Mật khẩu',
      isSecure: true,
    },
    leftIcon: <AntDesign name="lock" color={rootColor.whiteColor} size={20} />,
  },
];

const SignUpForm = ({showSignInForm}: {showSignInForm: () => void}) => {
  const [email, setEmail] = useState('');
  const [isCanSubmit, setIsCanSubmit] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const scrollX = useRef(new Animated.Value(0)).current;

  const signUp = async () => {
    if (email && displayName && password) {
      const res = await rootApi.register({
        email,
        password,
        displayName,
      });

      if (!res.body) {
        dispatch(showAlertAction({title: 'Lỗi', message: res}));
      } else {
        const isCreateMyFavorite = await rootApi.createMyFavorite(res.body._id);
        console.log(isCreateMyFavorite);
        await dispatch(login(res.body.email, password));
        navigation.navigate('MainDrawer');
      }
    }
  };

  useEffect(() => {
    console.log(currentIndex);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Đăng ký</Text>
      </View>
      <View style={styles.listInput}>
        <Animated.FlatList
          data={formField}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}
          onMomentumScrollEnd={e => {
            setCurrentIndex(
              Math.ceil(e.nativeEvent.contentOffset.x / dimensions.w),
            );
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          keyExtractor={(item, index) => index + ''}
          renderItem={({item, index}) => {
            return (
              <View style={styles.wrapInput}>
                <Text style={styles.label}>{item.label}</Text>
                <MyTextInput
                  isAutoFocus={currentIndex === index}
                  placeholder={item.config.placeholder}
                  value={
                    item.type === 'name'
                      ? displayName
                      : item.type === 'email'
                      ? email
                      : password
                  }
                  setValue={
                    item.type === 'name'
                      ? setDisplayName
                      : item.type === 'email'
                      ? setEmail
                      : setPassword
                  }
                  leftIcon={item.leftIcon}
                  secureText={item.config.isSecure}
                />
              </View>
            );
          }}
        />
        <View style={styles.containerDots}>
          <Dots scrollX={scrollX} acitveIndex={currentIndex} list={formField} />
        </View>
      </View>

      <View style={styles.actions}>
        <View style={{marginBottom: spacing.normal}}>
          <PrimaryBtn
            title="Đăng ký"
            callback={signUp}
            uppercase
            // disable={!isCanSubmit}
          />
        </View>
        <PrimaryBtn
          title="Đăng nhập"
          callback={showSignInForm}
          uppercase
          outline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dimensions.w,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listInput: {
    maxHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.normal * 2,
  },
  wrapInput: {
    width: dimensions.w,
    alignItems: 'center',
  },
  label: {
    fontFamily: rootFonts.semiBold,
    color: rootColor.primaryColor,
    marginBottom: spacing.normal,
  },
  containerDots: {
    zIndex: 1000,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    justifyContent: 'center',
    marginBottom: spacing.normal * 2,
  },
  headingText: {
    fontFamily: rootFonts.extraBold,
    color: rootColor.primaryColor,
    fontSize: 30,
  },
});

export default SignUpForm;
