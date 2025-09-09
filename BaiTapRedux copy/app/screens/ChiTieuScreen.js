import React, { useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  themChiTieuAPI, 
  xoaChiTieuAPI, 
  capNhatChiTieuAPI, 
  getTotalIncome, 
  getTotalExpense, 
  searchExpense,
  getFilteredExpenses,
  setSort
} from "../redux/reducers/reducer";
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  FlatList, 
  StyleSheet, 
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Alert
} from "react-native";

const ModalChiTieu = memo(({ 
  hienThi, 
  dangChinhSua, 
  tieuDe, 
  moTa, 
  ngay, 
  loai, 
  soTien,
  dongModal,
  luu,
  huy,
  thayDoiTieuDe,
  thayDoiMoTa,
  thayDoiNgay,
  thayDoiSoTien,
  thayDoiLoai
}) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleThayDoiTieuDe = useCallback((text) => {
    thayDoiTieuDe(text);
  }, [thayDoiTieuDe]);

  const handleThayDoiMoTa = useCallback((text) => {
    thayDoiMoTa(text);
  }, [thayDoiMoTa]);

  const handleThayDoiNgay = useCallback((text) => {
    thayDoiNgay(text);
  }, [thayDoiNgay]);

  const handleThayDoiSoTien = useCallback((text) => {
    thayDoiSoTien(text);
  }, [thayDoiSoTien]);

  const handleSelectType = useCallback((type) => {
    thayDoiLoai(type);
    setShowTypeDropdown(false);
  }, [thayDoiLoai]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={hienThi}
      onRequestClose={dongModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>
              {dangChinhSua ? 'Cập Nhật Giao Dịch' : 'Thêm Giao Dịch Mới'}
            </Text>
            
            <TextInput 
              style={styles.input}
              placeholder="Tiêu đề" 
              value={tieuDe} 
              onChangeText={handleThayDoiTieuDe}
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
            <TextInput 
              style={styles.input}
              placeholder="Mô tả" 
              value={moTa} 
              onChangeText={handleThayDoiMoTa}
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
            />
            <TextInput 
              style={styles.input}
              placeholder="Ngày" 
              value={ngay} 
              onChangeText={handleThayDoiNgay}
              placeholderTextColor="#666"
            />
            <TextInput 
              style={styles.input}
              placeholder="Số tiền" 
              keyboardType="numeric" 
              value={soTien} 
              onChangeText={handleThayDoiSoTien}
              placeholderTextColor="#666"
            />

            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={[
                  styles.dropdownButton,
                  { borderColor: loai === 'thu' ? '#4CAF50' : '#F44336' }
                ]}
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  { color: loai === 'thu' ? '#4CAF50' : '#F44336' }
                ]}>
                  {loai === "thu" ? "Thu nhập" : "Chi tiêu"}
                </Text>
                <Text style={[
                  styles.dropdownIcon,
                  showTypeDropdown && styles.dropdownIconOpen
                ]}>▼</Text>
              </TouchableOpacity>

              {showTypeDropdown && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity 
                    style={[
                      styles.dropdownItem,
                      loai === 'thu' && styles.dropdownItemSelected
                    ]}
                    onPress={() => handleSelectType('thu')}
                  >
                    <View style={styles.dropdownItemContent}>
                      <View style={[styles.typeIndicator, { backgroundColor: '#4CAF50' }]} />
                      <Text style={[
                        styles.dropdownItemText,
                        { color: '#4CAF50' }
                      ]}>Thu nhập</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.dropdownItem,
                      loai === 'chi' && styles.dropdownItemSelected
                    ]}
                    onPress={() => handleSelectType('chi')}
                  >
                    <View style={styles.dropdownItemContent}>
                      <View style={[styles.typeIndicator, { backgroundColor: '#F44336' }]} />
                      <Text style={[
                        styles.dropdownItemText,
                        { color: '#F44336' }
                      ]}>Chi tiêu</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.huyButton]} 
                onPress={huy}
              >
                <Text style={[styles.modalButtonText, { color: '#666' }]}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.luuButton]} 
                onPress={luu}
              >
                <Text style={styles.modalButtonText}>
                  {dangChinhSua ? 'Cập Nhật' : 'Thêm'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

const ManHinhChiTieu = () => {
  const [hienThiModal, setHienThiModal] = useState(false);
  const [dangChinhSua, setDangChinhSua] = useState(false);
  const [idChinhSua, setIdChinhSua] = useState(null);
  const [tieuDe, setTieuDe] = useState('');
  const [moTa, setMoTa] = useState('');
  const [ngay, setNgay] = useState('');
  const [loai, setLoai] = useState('thu');
  const [soTien, setSoTien] = useState('');
  const [tuKhoaTim, setTuKhoaTim] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSortModal, setShowSortModal] = useState(false);

  const danhSachLoc = useSelector(getFilteredExpenses);
  const dispatch = useDispatch();

  const themGiaoDich = useCallback(() => {
    if (tieuDe && soTien) {
      if (dangChinhSua && idChinhSua) {
        dispatch(capNhatChiTieuAPI({ 
          id: idChinhSua, 
          title: tieuDe, 
          description: moTa, 
          date: ngay, 
          type: loai, 
          amount: parseFloat(soTien) 
        }));
      } else {
        dispatch(themChiTieuAPI({ 
          title: tieuDe, 
          description: moTa, 
          date: ngay, 
          type: loai, 
          amount: parseFloat(soTien) 
        }));
      }
      resetForm();
    }
  }, [tieuDe, soTien, dangChinhSua, idChinhSua, moTa, ngay, loai, dispatch]);

  const resetForm = useCallback(() => {
    setTieuDe('');
    setMoTa('');
    setNgay('');
    setLoai('thu');
    setSoTien('');
    setHienThiModal(false);
    setDangChinhSua(false);
    setIdChinhSua(null);
  }, []);

  const chinhSuaGiaoDich = useCallback((giaoDich) => {
    setTieuDe(giaoDich.title);
    setMoTa(giaoDich.description);
    setNgay(giaoDich.date);
    setLoai(giaoDich.type);
    setSoTien(giaoDich.amount.toString());
    setIdChinhSua(giaoDich.id);
    setDangChinhSua(true);
    setHienThiModal(true);
  }, []);

  const xoaGiaoDich = useCallback((id, tieuDe) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa giao dịch "${tieuDe}" không?`,
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Xóa", 
          onPress: () => dispatch(xoaChiTieuAPI(id)),
          style: "destructive"
        }
      ]
    );
  }, [dispatch]);

  const timKiem = useCallback((text) => {
    setTuKhoaTim(text);
    dispatch(searchExpense(text));
  }, [dispatch]);

  const thayDoiLoai = useCallback(() => {
    setLoai(loai === "thu" ? "chi" : "thu");
  }, [loai]);

  const moModal = useCallback(() => {
    setHienThiModal(true);
  }, []);

  const dongModal = useCallback(() => {
    setHienThiModal(false);
  }, []);

  const handleSort = useCallback(() => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    dispatch(setSort(newSortOrder));
    setShowSortModal(false);
  }, [sortOrder, dispatch]);

  const getSortIcon = useCallback(() => {
    return sortOrder === 'asc' ? '↑' : '↓';
  }, [sortOrder]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản Lý Chi Tiêu</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tiêu đề" 
          value={tuKhoaTim} 
          onChangeText={timKiem}
          placeholderTextColor="#666"
        />
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortButtonText}>Sắp xếp {getSortIcon()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng Thu</Text>
          <Text style={styles.summaryAmountThu}>
            {useSelector(state => getTotalIncome(state))}đ
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng Chi</Text>
          <Text style={styles.summaryAmountChi}>
            {useSelector(state => getTotalExpense(state))}đ
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Lợi Nhuận</Text>
          <Text style={[
            styles.summaryAmount,
            useSelector(state => getTotalIncome(state) - getTotalExpense(state)) >= 0 
              ? styles.summaryAmountThu 
              : styles.summaryAmountChi
          ]}>
            {useSelector(state => getTotalIncome(state) - getTotalExpense(state))}đ
          </Text>
        </View>
      </View>

      <FlatList
        data={danhSachLoc}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.expenseItem}
            onPress={() => chinhSuaGiaoDich(item)}
          >
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>{item.title}</Text>
              <Text style={styles.expenseDescription}>{item.description}</Text>
              <Text style={styles.expenseDate}>{item.date}</Text>
            </View>
            <View style={styles.expenseAmountContainer}>
              <Text style={[
                styles.expenseAmount,
                item.type === 'thu' ? styles.thuText : styles.chiText
              ]}>
                {item.type === 'thu' ? '+' : '-'}{item.amount}đ
              </Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => xoaGiaoDich(item.id, item.title)}
              >
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={moModal}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <ModalChiTieu 
        hienThi={hienThiModal}
        dangChinhSua={dangChinhSua}
        tieuDe={tieuDe}
        moTa={moTa}
        ngay={ngay}
        loai={loai}
        soTien={soTien}
        dongModal={dongModal}
        luu={themGiaoDich}
        huy={resetForm}
        thayDoiTieuDe={setTieuDe}
        thayDoiMoTa={setMoTa}
        thayDoiNgay={setNgay}
        thayDoiSoTien={setSoTien}
        thayDoiLoai={thayDoiLoai}
      />

      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSortModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.sortModalContent}>
              <Text style={styles.sortModalTitle}>Sắp xếp theo số tiền</Text>
              <TouchableOpacity 
                style={styles.sortOption}
                onPress={handleSort}
              >
                <Text style={styles.sortOptionText}>
                  {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmountThu: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryAmountChi: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  expenseItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  thuText: {
    color: '#4CAF50',
  },
  chiText: {
    color: '#F44336',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    padding: 5,
    borderRadius: 3,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  dropdownContainer: {
    marginBottom: 15,
    position: 'relative',
    zIndex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
    transform: [{ rotate: '0deg' }],
    transition: '0.3s',
  },
  dropdownIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemSelected: {
    backgroundColor: '#f8f9fa',
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  huyButton: {
    backgroundColor: '#9e9e9e',
  },
  luuButton: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortButton: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    justifyContent: 'center',
  },
  sortButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  sortModalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sortModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  sortOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ManHinhChiTieu;
