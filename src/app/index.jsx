import { View, Text, StyleSheet,TouchableOpacity, Button, FlatList } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as FileSystem from 'expo-file-system';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { Dialog } from "../components/Dialog";

const filePath = `${FileSystem.documentDirectory}qrisData.json`;
// fetching data from json file
const getSavedData = async (setData)=>{
  try {
    const fileContent = await FileSystem.readAsStringAsync(filePath);
    const jsonData = JSON.parse(fileContent);
    setData(jsonData);
    return jsonData;
  } catch(error){
    throw error;
  }
};

const deleteData = async(id, setData)=>{
  try{
    const fileContent = await FileSystem.readAsStringAsync(filePath);
    const jsonData = JSON.parse(fileContent);
    const newData = jsonData.filter(item=>item.id !==id);
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(newData, null, 2));
    setData(newData);
  } catch(error){
    throw error;
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [qrisData, setData] = useState([]);

  const RenderItem = ({ item, onPress })=>{
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={{flex: 1,zIndex: 10}}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR',maximumFractionDigits:0}).format(item.amount)}</Text>
          <AntDesign name="qrcode" size={35} color="black"/>
          <Dialog trigger={
            <TouchableOpacity style={styles.icon}>
              <Feather name="trash" size={24} color="#f02e06"/>
            </TouchableOpacity> 
          } onDelete={()=>deleteData(item.id, setData)} />
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(()=>{
    getSavedData(setData);
  },[]);

  return (
    // <SafeAreaProvider>
    <View style={styles.container}>
      <View style={{ justifyContent: 'space-between', padding: 20, paddingBottom: 10, zIndex: 10}}>
        {/* <Text style={{fontFamily: 'GeistMono-Medium', fontSize: 15}}>your saved qris</Text> */}
        {qrisData.length!==0? <Text style={{fontFamily: 'GeistMono-Medium', fontSize: 15}}>your saved qris</Text> : <Text style={{fontFamily: 'GeistMono-Medium', fontSize: 15}}>You don't have any qris scanned</Text> }
      </View>
      <FlatList 
        data={qrisData}
        renderItem={({item})=> <RenderItem item={item} onPress={()=>router.push({pathname: '/qrisPage', params: {id: item.id, qrRaw: item.qrisRaw}})} />}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        />
      <TouchableOpacity style={styles.qrisBtn} onPress={()=>router.push('cameraPage')}>
        <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
      </TouchableOpacity>
    </View>
    // </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FEF9EF'
  },
  card: {
    flexDirection: 'row',
    // alignItems: 'center',      // tengah secara vertikal
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 2,
    borderRadius: 2,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    // margin: 64,
  },
  icon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    // right: 10,
  },
  button: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#C6A4FF',
    height: 50,
    marginLeft:50,
    marginRight:50,
    marginBottom: 20,
    borderRadius: 20,
  },
  itemName: {
    position: 'absolute',
    fontFamily: 'GeistMono-Medium',
    fontSize: 15,
    bottom: 25,
    left: 40,
    justifyContent: 'center',
    zIndex: 10,
  },
  itemPrice: {
    position: 'absolute',
    fontFamily: 'GeistMono-Medium',
    fontSize: 15,
    bottom: 2,
    left: 40,
    justifyContent: 'center'
  },
  qrisBtn:{
    zIndex: 10,
    position: 'absolute',
    backgroundColor: '#FFDB58',
    width: 65,
    height: 65,
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 3,
  }
});