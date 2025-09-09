import React, { useState, useCallback, createContext } from 'react';

export interface HoaDon {
  id: string;
  khachHang: string;
  sanPham: string;
  soLuong: number;
  gia: number;
  hoanThanh: boolean;
}

export interface HoaDonContextType {
  hoaDons: Array<HoaDon>;
  setHoaDons: React.Dispatch<React.SetStateAction<any[]>>;
  capNhatHoaDon: (id: string, hoaDonMoi: HoaDon) => void;
  xoaHoaDon: (id: string) => void;
  themHoaDon: (hoaDonMoi: Omit<HoaDon, 'id'>) => void;
}

export const HoaDonContext = createContext<HoaDonContextType>({
  hoaDons: [],
  setHoaDons: () => {},
  capNhatHoaDon: () => {},
  xoaHoaDon: () => {},
  themHoaDon: () => {}
});

export const CompoCha = ({ children }: { children: React.ReactNode }) => {
  const [hoaDons, setHoaDons] = useState<HoaDon[]>([
    { id: 'HD001', khachHang: 'Hoang Tien Dat', sanPham: 'Bánh kem', soLuong: 2, gia: 50000, hoanThanh: false },
    { id: 'HD002', khachHang: 'Nguyen Hoang Van', sanPham: 'Bánh mì', soLuong: 5, gia: 20000, hoanThanh: true },
  ]);

  const capNhatHoaDon = useCallback((id: string, hoaDonMoi: HoaDon) => {
    console.log('Cap nhat hoa don')
    setHoaDons(item => item.map(hd => (hd.id === id ? hoaDonMoi : hd)));
  }, []);

  const xoaHoaDon = useCallback((id: string) => {
    console.log('Xoa hoa don')
    setHoaDons(item => item.filter(hd => hd.id !== id));
  }, []);

  const themHoaDon = useCallback((hoaDonMoi: Omit<HoaDon, 'id'>) => {
    console.log('Them hoa don')
    const newId = `HD${(hoaDons.length + 1).toString().padStart(3, '0')}`;
    setHoaDons(item => [...item, { ...hoaDonMoi, id: newId }]);
  }, [hoaDons.length]);

  return (
    <HoaDonContext.Provider value={{ hoaDons, setHoaDons, capNhatHoaDon, xoaHoaDon, themHoaDon }}>
      {children}
    </HoaDonContext.Provider>
  );
}; 