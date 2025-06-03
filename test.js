const parseEMVQR = (qrString) => {
  const result = {};
  let index = 0;

  while (index < qrString.length) {
    const tag = qrString.substr(index, 2);
    const length = parseInt(qrString.substr(index + 2, 2), 10);
    const value = qrString.substr(index + 4, length);
    result[tag] = value;
    index += 4 + length;
    if (tag === '26') {
      result['26_parsed'] = parseEMVQR(value);
    }
  }

  return result;
};

const isQRIS = (qrString) => {
  const parsed = parseEMVQR(qrString);
  const merchantInfo = parsed['26_parsed'];
  console.log(merchantInfo);
  if (!merchantInfo) return false;
  return Object.values(merchantInfo).some(value =>
    /ID\.(CO\.)?QRIS|ID\.DANA|ID\.OVO|ID\.LINKAJA|ID\.SHOPEEPAY/i.test(value)
  );
};

console.log(isQRIS("00020101021226660014ID.LINKAJA.WWW011893600911002410590102152006220410590100303UME51450015ID.OR.GPNQR.WWW02150000000000000000303UME520454995802ID5911Tuan Nyonya6013Jakarta Pusat610510510623801156DuzVIl5dSE2z3m07156DuzVIl5dSE2z3m5303360540450006304D57D"))