import React, { useState, useMemo, useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { HoaDonContext, HoaDon } from './CompoCha';
import { ThemHoaDon } from './ThemHoaDon';
import { UpdateHoaDon } from './UpdateHoaDon';
import { XemChiTietHoaDon } from './XemChiTietHoaDon';
import { XacNhanXoa } from './XacNhanXoa';

export const CompoCon = () => {
  const { hoaDons, xoaHoaDon } = useContext(HoaDonContext);
  const [hoaDonUpdate, setHoaUpdate] = useState<HoaDon | null>(null);
  const [hoaDonXem, setHoaDonXem] = useState<HoaDon | null>(null);
  const [hoaDonXoa, setHoaDonXoa] = useState<HoaDon | null>(null);
  const [showThemMoi, setShowThemMoi] = useState(false);
  
  const daHoanThanh = useMemo(() =>  hoaDons.filter(hd => hd.hoanThanh).length, [hoaDons]);
  const chuaHoanThanh = useMemo(() => hoaDons.length - daHoanThanh, [hoaDons]);

  const xuLyXoaHoaDon = useCallback(() => {
    if (hoaDonXoa) {
      xoaHoaDon(hoaDonXoa.id);
      setHoaDonXoa(null);
    }
  }, [hoaDonXoa, xoaHoaDon]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statsItem, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.statsNumber}>{daHoanThanh}</Text>
            <Text style={styles.statsLabel}>Hoàn thành</Text>
          </View>
          <View style={[styles.statsItem, { backgroundColor: '#f44336' }]}>
            <Text style={styles.statsNumber}>{chuaHoanThanh}</Text>
            <Text style={styles.statsLabel}>Chưa hoàn thành</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowThemMoi(true)}
        >
          <Text style={styles.addButtonText}>+ Thêm hóa đơn mới</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={hoaDons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.itemContainer]}
            onPress={() => setHoaDonXem(item)}
          >
            <View style={[
              styles.itemStatusBar,
              { backgroundColor: item.hoanThanh ? '#4CAF50' : '#f44336' }
            ]} />
            
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemId}>{item.id}</Text>
                  <Text style={styles.itemCustomer}>{item.khachHang}</Text>
                  <Text style={styles.itemTotal}>{(item.soLuong * item.gia).toLocaleString()} VND</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={() => setHoaUpdate(item)}>
                    <Text style={styles.buttonText}>Cập nhật</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, { backgroundColor: '#f44336' }]}
                    onPress={() => setHoaDonXoa(item)}
                  >
                    <Text style={styles.buttonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
      {hoaDonUpdate && (
        <UpdateHoaDon 
          hoaDon={hoaDonUpdate} 
          onClose={() => setHoaUpdate(null)}
          visible={!!hoaDonUpdate}
        />
      )}
      {hoaDonXem && (
        <XemChiTietHoaDon 
          hoaDon={hoaDonXem} 
          onClose={() => setHoaDonXem(null)}
          visible={!!hoaDonXem}
        />
      )}
      {hoaDonXoa && (
        <XacNhanXoa 
          hoaDon={hoaDonXoa} 
          onClose={() => setHoaDonXoa(null)}
          onConfirm={xuLyXoaHoaDon}
          visible={!!hoaDonXoa}
        />
      )}
      <ThemHoaDon visible={showThemMoi} onClose={() => setShowThemMoi(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  headerContainer: {
    marginBottom: 20
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10
  },
  statsItem: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  statsNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  statsLabel: {
    color: 'white',
    fontSize: 14,
    marginTop: 5
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5
  },
  itemStatusBar: {
    width: 6
  },
  itemContent: {
    flex: 1,
    padding: 15
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemInfo: {
    flex: 1
  },
  itemId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  itemCustomer: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  listContent: {
    paddingBottom: 20
  }
}); 