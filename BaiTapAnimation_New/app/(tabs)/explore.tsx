import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { ViewToken } from 'react-native';

const data = Array.from({ length: 50 }).map((_, index) => ({
  id: index.toString(),
  text: `Item ${index + 1}`,
}));

interface ListItemProps {
  item: { id: string; text: string };
  viewableItems: Animated.SharedValue<ViewToken[]>;
}

const ListItem: React.FC<ListItemProps> = React.memo(({ item, viewableItems }) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((viewableItem) => viewableItem.isViewable)
        .find((viewableItem) => viewableItem.item.id === item.id)
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0), 
      transform: [
        { scale: withTiming(isVisible ? 1 : 0.6) }, 
      ],
    };
  }, []); 

  return (
    <Animated.View style={[styles.itemContainer, rStyle]}>
      <Text style={styles.itemText}>{item.text}</Text>
    </Animated.View>
  );
});

const Explore = () => {
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const onViewableItemsChanged = useCallback(({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
    viewableItems.value = vItems;
  }, [viewableItems]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        renderItem={({ item }) => {
          return <ListItem item={item} viewableItems={viewableItems} />;
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  itemContainer: {
    height: 80,
    width: '90%',
    backgroundColor: '#ADD8E6', 
    marginBottom: 15,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Explore; 