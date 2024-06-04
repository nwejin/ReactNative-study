import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import Test from './screen/test';

import axios from 'axios';

const STORAGE_KEY = '@toDos';

export default function App() {
  useEffect(() => {
    loadToDos();
  }, []);

  const [working, setWorking] = useState(true);
  const [isCalendar, setIsCalendar] = useState(false);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});

  const [isDB, setIsDB] = useState('');

  const work = () => {
    setWorking(true);
    setIsCalendar(false);
  };
  const travel = () => {
    setWorking(false);
    setIsCalendar(false);
  };
  const calendar = () => {
    setIsCalendar(true);
  };
  const onChangeText = (payLoad) => setText(payLoad);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      console.log(s);
      setToDos(JSON.parse(s));
    } catch (error) {
      console.log(error);
    }
  };

  const addToDo = async () => {
    if (text === '') {
      return;
    }
    // todo 저장
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text, working },
    });
    // const newToDos = { ...toDos, [Date.now()]: { text, work: working },}
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };
  // console.log(toDos);

  const testSubmit = async () => {
    try {
      const data = { content: isDB };
      console.log('data >', isDB);
      const response = await dataPost(isDB);
    } catch (err) {
      console.log(err);
    }
  };

  const dataPost = async (data) => {
    try {
      const res = await axios.post(
        'http://172.30.1.55:3000',
        { content: data },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log('res >', res);
      return res;
    } catch (error) {
      throw new Error('post 오류 발생');
    }
  };

  const deleteToDo = (key) => {
    // Alert.prompt('이름을 입력해주세요');
    Alert.alert('삭제하시겠습니까?', '정말요?', [
      { text: 'cancle' },
      {
        text: 'yes',
        style: 'destructive',
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
    return;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? 'white' : theme.gray,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? 'white' : theme.gray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TextInput
          // multiline
          autoCorrect
          onChangeText={(e) => {
            setIsDB(e);
          }}
          placeholderTextColor={theme.gray}
          returnKeyType="send"
          value={isDB}
          placeholder="DB 연결 실험"
          onSubmitEditing={testSubmit}
          style={styles.input}
        />
      </View>

      <View>
        <TextInput
          // multiline
          autoCorrect
          onChangeText={onChangeText}
          placeholderTextColor={theme.gray}
          returnKeyType="send"
          value={text}
          placeholder={
            working ? '할 일을 입력해주세요' : '여행지를 입력해주세요'
          }
          onSubmitEditing={addToDo}
          style={styles.input}
        />
      </View>
      <ScrollView style={styles.mainContainer}>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <FontAwesome name="trash" size={18} color="white" />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.black,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600',
    color: theme.gray,
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    // marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  toDo: {
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
