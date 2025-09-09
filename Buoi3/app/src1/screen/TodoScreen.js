import { useDispatch, useSelector } from "react-redux";
import { fetchTodos,deleteTodoApi,addTodoAPI } from "../../src1/redux/actions/TodoAction";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";




const TodoScreen = ()=>{
    const [title, setTitle] = useState('');
  // lấy danh sách dữ liệu từ store của redux
  const listTodo = useSelector(state => state.listTodoStore.listTodo );




  // lấy đối tượng dispatch để điều khiển các action
  const dispatch = useDispatch();




  // gọi effect khi vào màn hình thì sẽ lấy dữ liệu từ API
  useEffect( ()=>{
      dispatch( fetchTodos() );
   }, [dispatch])

   // hàm xử lý xóa:
   const handleDeleteTodo = async (id) =>{
    dispatch( deleteTodoApi(id))
        .then( (res) => {
            console.log("Xóa thành công");
        })
        .catch( (e)=>{
            console.error('Lỗi xóa: ' , e);
           
        })
    }

    const handleAddTodo = ()=>{
        let duLieuThem = {  title: title , status: false};
        // dispatch( addTodo ( duLieuThem )  );
        dispatch(addTodoAPI(duLieuThem))
        .then((result) => {
            // console.log(result);
            console.log('Todo add successfully!');
        })
        .catch((error) => {
            console.error('Error add todo:', error);
        });
    }






   // xử lý view
   return(
     <ScrollView>
        <TextInput placeholder="Nhập công việc" onChangeText={setTitle} />
            <View style={{width:100}}>
                <Button title="Thêm việc" onPress={handleAddTodo} />
            </View>
         <View>
          { // hiển thị danh sách
              listTodo.map(row =>  (
                      <View key={row.id}
                      style={{margin:10, padding:10, borderColor: 'blue', borderWidth:1}}>
                          <Text>{row.title} === {row.id}</Text>
                          <Text onPress={() => handleDeleteTodo(row.id)}>Xoá</Text>
                      </View>
                  )
              )
          }
      </View>
     </ScrollView>
   )
}
export default TodoScreen;
