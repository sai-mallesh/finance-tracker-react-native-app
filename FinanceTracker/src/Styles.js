import {StyleSheet} from 'react-native';
export const globalStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer:{
    marginHorizontal:10,
    marginVertical:10,
    alignItems:'center',
    justifyContent:'center',
  },
  text:{
    color:'#ffffff'
  },
  shadow:{
    shadowColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 12,
  },
  button: {
    height: 40,
    borderRadius: 15,
    width: 200,
    backgroundColor: '#0E8388',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexDirection:'row',
  },
  buttonText:{
    marginLeft:10,
    fontWeight:'bold',
  },
});
