import { View, Text, StyleSheet,TouchableOpacity, Button } from "react-native";
import { AppText } from "../components/AppText";
import { Link, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { CameraView, CameraType, useCameraPermissions, TorchMode, Camera} from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function cameraPage() {
  const navigation = useNavigation();
  const router = useRouter();
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setCamera] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState('');
  const [isTorch, setTorch] = useState(false);

  // useEffect(()=>{
  //   navigation.setOptions({ headerShown: false });
  // },[navigation]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <View style={styles.premission}>
          <TouchableOpacity style={styles.premisButton} onPress={requestPermission}>
            <Text style={{fontFamily: 'GeistMono-Medium'}}>Izinkan Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  async function toggleTorch() {
    setTorch((prev)=>!prev);
  }
  
  const handleQr=({ type, data })=>{
    let qrisModified = data.slice(0, -4).replace("010211", "010212");
    let qrisParts = qrisModified.split("5802ID")[1].split(" ")[0]; 
    setScanned(true);
    setQrData(data);
    // alert(`qr detected: ${data}`);
    router.push({
      pathname: '/qrisPage',
      params: {id: qrisParts, qrRaw: data},
    })
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} barcodeScannerSettings={{barcodeTypes:['qr']}} onBarcodeScanned={scanned? undefined : handleQr} enableTorch={isTorch}>
        {/* {scanned && (<Button title="scan again" onPress={()=>setScanned(false)}></Button>)} */}
        {/* {qrData && <Text style={styles.text}>result: {qrData}</Text>} */}
        <View style={styles.buttonContainer}>
        </View>
      </CameraView>
      {/* <View style={styles.overlay}> */}
      <SafeAreaView style={styles.overlay} edges={['top','bottom']}>
        <TouchableOpacity style={styles.flashButton} onPress={toggleTorch}>
          <Ionicons name="flashlight-outline" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={()=>navigation.navigate("index")}>
          <Ionicons name="return-up-back" size={25} color="black" />
        </TouchableOpacity>
      </SafeAreaView>
        
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    bottom: 50,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // <== isi seluruh layar, tapi tetap respect safe area
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 10,
  },
  backBtn: {
    // flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: '#C4A1FF',
    marginTop: 40,
    marginLeft: 20,
    width: 55,
    height: 35,
    borderRadius: 20,
    zIndex: 10,
  },
  flashButton: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    backgroundColor: '#C4A1FF',
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderEndWidth: 3,
    borderBottomWidth: 3,
    zIndex: 10,
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  premission: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF9EF', // opsional transparansi
  },
  premisButton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: '#C4A1FF',
    marginTop: 40,
    marginLeft: 20,
    width: 200,
    height: 50,
    borderRadius: 15,
    borderWidth: 3,
  }

});
