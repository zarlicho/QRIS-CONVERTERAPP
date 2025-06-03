import { View, Text, StyleSheet,TouchableOpacity, Button, FlatList, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { AppText } from "../components/AppText";
import { Link, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CurrencyInput from 'react-native-currency-input';
import qrisDinamis from 'qris-dinamis';
import QRCode from "react-native-qrcode-svg";

const AmountInput = ({ value, onValueChange }) => {
  return (
    <CurrencyInput
      value={value}
      prefix="Rp "
      delimiter="."
      separator=","
      precision={0}
      minValue={0}
      onChangeValue={onValueChange}
      style={styles.input}
      keyboardType="number-pad"
    />
  );
};


const SaveData = async (name, amount, qrisData, id) => {
  const filePath = `${FileSystem.documentDirectory}qrisData.json`;

  // Ensure the file exists
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (!fileInfo.exists) {
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify([]));
  }

  // Create the new QRIS data
  const qrisModified = qrisDinamis.makeString(qrisData, { nominal: amount.toString() });
  const qrisEntry = {
    name,
    amount,
    qrisModified,
    qrisRaw: qrisData,
    id: `${id}-${name.split(' ').at(-1)}-${amount}`
  };

  try {
    const fileContent = await FileSystem.readAsStringAsync(filePath);
    const existingData = JSON.parse(fileContent);

    if (!Array.isArray(existingData)) {
      throw new Error("Data file is not an array.");
    }

    existingData.push(qrisEntry);

    await FileSystem.writeAsStringAsync(
      filePath,
      JSON.stringify(existingData),
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    return qrisModified;

  } catch (error) {
    throw error;
  }
};


const FindQrData = async(id)=>{
  try {
      const fileContent = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}qrisData.json`);
      const jsonData = JSON.parse(fileContent);
      const foundData = jsonData.find(qrData=>qrData.id === id);
      return foundData;
    } catch(error){
      // console.log("there is an error: ", error);
      throw error;
    }
};

export default function HomeScreen() {
  const { id, qrRaw } = useLocalSearchParams();
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState('');
  const [qrModified, setQr] = useState('');

  useEffect(()=>{
    const getData = async()=>{
      const foundData = await FindQrData(id);
      if (foundData!=undefined){
        setName(foundData.name);  
        setAmount(foundData.amount);  
        setQr(foundData.qrisModified);
      }
    }
    getData();
  }, [id]);

  const handleSaveQr = async (name, amount, qrData, id)=>{
    try{
      if (name && amount !== null){
        const qrisModified = await SaveData(name, amount, qrData, id);
        // console.log(qrisModified);
        setQr(qrisModified); 
      }
    }catch(error){};
  };

  return (
		<View style={styles.container}>
			<TextInput style={styles.input} onChangeText={setName} value={name} placeholder="Nama qris" />        
			{/* <TextInput style={styles.input} onChangeText={setAmount} value={new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(amount)} placeholder="Rp" keyboardType="numeric"/>         */}
      <AmountInput value={amount} onValueChange={setAmount}></AmountInput>
      {qrModified!== '' && <View style={styles.qris}><QRCode value={qrModified} size={250}/></View>}
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.saveBtn} onPress={()=>handleSaveQr(name, amount, qrRaw, id.split("-")[0])} pres>
        <Text style={{fontFamily: 'GeistMono-Medium'}}>Generate & Save</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FEF9EF',
    padding: 20,
  },
  input: 
	  {
	  backgroundColor: '#fff',
	  borderRadius: 5,
	  justifyContent: 'center',
	  alignItems: 'center',
	  borderWidth: 2,
	  padding: 10,
    fontFamily: 'GeistMono-Medium',
	//   bottom: 220,
	  marginBottom: 25,
    borderWidth: 3,
	},
  qris: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 50,
    left: '50%',
    transform: [{ translateX: -137.5 }, { translateY: -30 }],
    width: 275,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: '#FF6842',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 200
  },
  saveBtn: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    left: 30,
    right: 30,
    backgroundColor: '#7FBC8C',
    padding: 15,
    borderRadius: 15,
    borderWidth: 3,
  },
});