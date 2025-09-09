import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Banner } from '../types/product';

interface BannerSlideshowProps {
  banners: Banner[];
}

const BannerSlideshow: React.FC<BannerSlideshowProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < banners.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
      
      scrollViewRef.current?.scrollTo({
        x: screenWidth * (currentIndex < banners.length - 1 ? currentIndex + 1 : 0),
        animated: true
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.bannerContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          setCurrentIndex(newIndex);
        }}
      >
        {banners.map((banner, index) => (
          <Image
            key={banner.id_banner + index}
            source={{ uri: banner.image }}
            style={[styles.bannerImage, { width: screenWidth - 40 }]}
          />
        ))}
      </ScrollView>
      <View style={styles.bannerPagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  bannerImage: {
    height: 115,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E2E2',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#53B175',
    width: 20,
  },
});

export default BannerSlideshow; 