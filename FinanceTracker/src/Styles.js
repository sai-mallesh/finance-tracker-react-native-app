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
    color:'#ffffff',
  },
  containerFlexDirRow:{
    flexDirection:'row',
    alignItems:'center',
  },
  textHeading:{
    fontSize:25,
    fontWeight:'bold',
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
  iconButton:{
    marginLeft:10,
  },
  buttonText:{
    fontWeight:'bold',
  },
  container:{
    width:'100%',
  },
  cardLevelOne:{
    backgroundColor:'#151515',
    width:'100%',
    borderRadius:10,
    padding:10,
    marginVertical:10,
  },
});
