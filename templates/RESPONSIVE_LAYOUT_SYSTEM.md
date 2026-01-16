# Responsive Layout System

> iPhone, iPad, and Web from Day One

## Why This Matters

Adding multi-pane layouts later breaks:
- Navigation (stack vs inline detail)
- State management (selected item lives where?)
- Component APIs (callbacks vs navigation params)
- Styling (hardcoded widths everywhere)

**Build responsive from the first commit.**

---

## Core Files

### 1. `lib/layout/constants.ts`

```typescript
/**
 * Breakpoints based on Apple HIG and Material Design
 *
 * compact: iPhone (all), Android phones
 * medium: iPad portrait, iPad split-view, small tablets, narrow browser
 * expanded: iPad landscape, large tablets, desktop browser
 */

export const BREAKPOINTS = {
  compact: 0,      // 0-599
  medium: 600,     // 600-1023
  expanded: 1024,  // 1024+
} as const;

export const SIDEBAR_WIDTH = {
  collapsed: 0,
  compact: 72,      // Icons only
  medium: 240,      // Icons + labels
  expanded: 320,    // Full sidebar
} as const;

export const DETAIL_PANE = {
  minWidth: 400,
  preferredWidth: 480,
  maxWidth: 600,
} as const;

export const MODAL_WIDTH = {
  compact: '100%',
  medium: 540,
  expanded: 640,
} as const;

// Touch targets per Apple HIG
export const TOUCH_TARGET = {
  minimum: 44,
  comfortable: 48,
} as const;
```

### 2. `lib/layout/useLayout.ts`

```typescript
import { useWindowDimensions, Platform } from 'react-native';
import { useMemo } from 'react';
import { BREAKPOINTS, SIDEBAR_WIDTH, DETAIL_PANE } from './constants';

export type LayoutMode = 'compact' | 'medium' | 'expanded';

export interface LayoutInfo {
  // Current mode
  mode: LayoutMode;

  // Convenience booleans
  isCompact: boolean;
  isMedium: boolean;
  isExpanded: boolean;

  // Layout decisions
  showSidebar: boolean;
  showDetailPane: boolean;
  sidebarWidth: number;

  // Raw dimensions
  width: number;
  height: number;

  // Platform
  isWeb: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export function useLayout(): LayoutInfo {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const mode: LayoutMode =
      width < BREAKPOINTS.medium ? 'compact' :
      width < BREAKPOINTS.expanded ? 'medium' :
      'expanded';

    const isCompact = mode === 'compact';
    const isMedium = mode === 'medium';
    const isExpanded = mode === 'expanded';

    // Sidebar visible on medium+ (but could be icon-only on medium)
    const showSidebar = !isCompact;

    // Detail pane only on expanded (enough room for list + detail)
    const showDetailPane = isExpanded && width >= (SIDEBAR_WIDTH.medium + 300 + DETAIL_PANE.minWidth);

    const sidebarWidth = isCompact
      ? SIDEBAR_WIDTH.collapsed
      : isMedium
        ? SIDEBAR_WIDTH.medium
        : SIDEBAR_WIDTH.expanded;

    return {
      mode,
      isCompact,
      isMedium,
      isExpanded,
      showSidebar,
      showDetailPane,
      sidebarWidth,
      width,
      height,
      isWeb: Platform.OS === 'web',
      isIOS: Platform.OS === 'ios',
      isAndroid: Platform.OS === 'android',
    };
  }, [width, height]);
}
```

### 3. `lib/layout/LayoutShell.tsx`

```typescript
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLayout, LayoutInfo } from './useLayout';

interface LayoutContextValue extends LayoutInfo {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function useLayoutContext() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayoutContext must be used within LayoutShell');
  return ctx;
}

interface LayoutShellProps {
  children: ReactNode;
  sidebar?: ReactNode;
  detail?: ReactNode;
}

export function LayoutShell({ children, sidebar, detail }: LayoutShellProps) {
  const layout = useLayout();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const contextValue: LayoutContextValue = {
    ...layout,
    selectedId,
    setSelectedId,
    sidebarCollapsed,
    toggleSidebar,
  };

  const effectiveSidebarWidth = layout.showSidebar && !sidebarCollapsed
    ? layout.sidebarWidth
    : layout.showSidebar && sidebarCollapsed
      ? 72  // Icon-only
      : 0;

  return (
    <LayoutContext.Provider value={contextValue}>
      <View style={styles.container}>
        {/* Sidebar */}
        {layout.showSidebar && sidebar && (
          <View style={[styles.sidebar, { width: effectiveSidebarWidth }]}>
            {sidebar}
          </View>
        )}

        {/* Main content */}
        <View style={styles.main}>
          {children}
        </View>

        {/* Detail pane (expanded only) */}
        {layout.showDetailPane && detail && selectedId && (
          <View style={styles.detail}>
            {detail}
          </View>
        )}
      </View>
    </LayoutContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#e0e0e0',
  },
  main: {
    flex: 1,
  },
  detail: {
    width: 480,
    maxWidth: '40%',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#e0e0e0',
  },
});
```

### 4. `lib/layout/useAdaptiveNavigation.ts`

```typescript
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLayoutContext } from './LayoutShell';

/**
 * Navigation that adapts to layout:
 * - Compact: push to navigation stack
 * - Expanded: update selectedId, show in detail pane
 */
export function useAdaptiveNavigation() {
  const navigation = useNavigation();
  const { showDetailPane, setSelectedId, selectedId } = useLayoutContext();

  const navigateToDetail = useCallback((
    id: string,
    screenName = 'Detail',
    params?: Record<string, unknown>
  ) => {
    if (showDetailPane) {
      // iPad landscape / web: show inline
      setSelectedId(id);
    } else {
      // iPhone / iPad portrait: push screen
      navigation.navigate(screenName as never, { id, ...params } as never);
    }
  }, [showDetailPane, setSelectedId, navigation]);

  const goBack = useCallback(() => {
    if (showDetailPane) {
      // Clear selection
      setSelectedId(null);
    } else {
      // Pop navigation
      navigation.goBack();
    }
  }, [showDetailPane, setSelectedId, navigation]);

  const isSelected = useCallback((id: string) => {
    return showDetailPane && selectedId === id;
  }, [showDetailPane, selectedId]);

  return {
    navigateToDetail,
    goBack,
    isSelected,
    selectedId,
  };
}
```

### 5. `lib/layout/AdaptiveModal.tsx`

```typescript
import React, { ReactNode } from 'react';
import { Modal, View, StyleSheet, Pressable, Platform } from 'react-native';
import { useLayout } from './useLayout';
import { MODAL_WIDTH } from './constants';

interface AdaptiveModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function AdaptiveModal({ visible, onClose, children }: AdaptiveModalProps) {
  const { isCompact, isWeb } = useLayout();

  // Full screen on compact, centered card on medium+
  const presentationStyle = isCompact ? 'fullScreen' : 'formSheet';

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType={isCompact ? 'slide' : 'fade'}
      presentationStyle={Platform.OS === 'ios' ? presentationStyle : undefined}
      transparent={!isCompact}
    >
      {isCompact ? (
        // Full screen modal
        <View style={styles.fullScreen}>
          {children}
        </View>
      ) : (
        // Centered modal with backdrop
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[
              styles.card,
              { width: isWeb ? MODAL_WIDTH.expanded : MODAL_WIDTH.medium }
            ]}
            onPress={e => e.stopPropagation()}
          >
            {children}
          </Pressable>
        </Pressable>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '80%',
    overflow: 'hidden',
  },
});
```

### 6. `lib/layout/ResponsiveGrid.tsx`

```typescript
import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLayout } from './useLayout';

interface ResponsiveGridProps {
  children: ReactNode;
  minItemWidth?: number;
  spacing?: number;
}

export function ResponsiveGrid({
  children,
  minItemWidth = 280,
  spacing = 16
}: ResponsiveGridProps) {
  const { width, sidebarWidth, showDetailPane } = useLayout();

  // Available width minus sidebar and detail pane
  const availableWidth = width
    - sidebarWidth
    - (showDetailPane ? 480 : 0)
    - spacing * 2; // Container padding

  const columns = Math.max(1, Math.floor(availableWidth / minItemWidth));
  const itemWidth = (availableWidth - spacing * (columns - 1)) / columns;

  const childArray = React.Children.toArray(children);

  return (
    <View style={[styles.grid, { padding: spacing }]}>
      {childArray.map((child, index) => (
        <View
          key={index}
          style={[
            styles.item,
            {
              width: itemWidth,
              marginRight: (index + 1) % columns === 0 ? 0 : spacing,
              marginBottom: spacing,
            }
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {},
});
```

### 7. `lib/layout/index.ts`

```typescript
export * from './constants';
export * from './useLayout';
export * from './LayoutShell';
export * from './useAdaptiveNavigation';
export * from './AdaptiveModal';
export * from './ResponsiveGrid';
```

---

## Usage Example

### App Root

```typescript
// App.tsx
import { LayoutShell } from '@/lib/layout';
import { Sidebar } from './components/Sidebar';
import { DetailPane } from './components/DetailPane';
import { MainNavigator } from './navigation/MainNavigator';

export default function App() {
  return (
    <LayoutShell
      sidebar={<Sidebar />}
      detail={<DetailPane />}
    >
      <MainNavigator />
    </LayoutShell>
  );
}
```

### List Screen

```typescript
// screens/ItemList.tsx
import { FlatList } from 'react-native';
import { useAdaptiveNavigation } from '@/lib/layout';
import { ListItem } from '@/components/ListItem';

export function ItemListScreen() {
  const { navigateToDetail, isSelected } = useAdaptiveNavigation();
  const { data } = useItems();

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <ListItem
          item={item}
          selected={isSelected(item.id)}
          onPress={() => navigateToDetail(item.id)}
        />
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

### Detail Screen (used both inline and as pushed screen)

```typescript
// screens/ItemDetail.tsx
import { useRoute } from '@react-navigation/native';
import { useLayoutContext } from '@/lib/layout';

export function ItemDetailScreen() {
  // Get ID from either route params OR layout context
  const route = useRoute();
  const { selectedId, showDetailPane } = useLayoutContext();

  const id = showDetailPane
    ? selectedId
    : (route.params as { id: string })?.id;

  if (!id) return null;

  const { data: item } = useItem(id);

  return (
    <ScrollView>
      {/* Detail content */}
    </ScrollView>
  );
}
```

### Detail Pane Wrapper

```typescript
// components/DetailPane.tsx
import { ItemDetailScreen } from '@/screens/ItemDetail';
import { useLayoutContext } from '@/lib/layout';

export function DetailPane() {
  const { selectedId } = useLayoutContext();

  if (!selectedId) {
    return <EmptyState message="Select an item" />;
  }

  return <ItemDetailScreen />;
}
```

---

## Testing Checklist

Before every PR, test on:

| Device | Mode | Check |
|--------|------|-------|
| iPhone SE | compact | Single column, nav pushes |
| iPhone 15 Pro Max | compact | Single column, larger text visible |
| iPad mini (portrait) | medium | Sidebar visible, nav pushes |
| iPad Pro (landscape) | expanded | Sidebar + list + detail pane |
| iPad split view (1/3) | compact | Falls back to single column |
| iPad split view (2/3) | medium | Sidebar visible |
| Web 1280px | expanded | Full three-pane |
| Web 800px | medium | Two-pane |
| Web 500px | compact | Single column |

### Simulator Commands

```bash
# iOS simulators
xcrun simctl list devices

# Run on specific device
npx expo run:ios --device "iPad Pro (12.9-inch)"

# Web with specific viewport
# Open browser dev tools, toggle device toolbar
```

---

## Common Mistakes

### ❌ Hardcoded navigation

```typescript
// Breaks on iPad landscape
onPress={() => navigation.navigate('Detail', { id })}
```

### ✅ Adaptive navigation

```typescript
const { navigateToDetail } = useAdaptiveNavigation();
onPress={() => navigateToDetail(id)}
```

### ❌ Fixed widths

```typescript
<View style={{ width: 320 }}>
```

### ✅ Layout-aware widths

```typescript
const { sidebarWidth } = useLayout();
<View style={{ width: sidebarWidth }}>
```

### ❌ Single-column assumption

```typescript
<FlatList style={{ flex: 1 }} />
```

### ✅ Pane-aware layout

```typescript
const { showDetailPane } = useLayout();
<FlatList style={{ flex: 1, maxWidth: showDetailPane ? 400 : undefined }} />
```

### ❌ Full-screen modals everywhere

```typescript
<Modal presentationStyle="fullScreen">
```

### ✅ Adaptive modals

```typescript
<AdaptiveModal visible={show} onClose={hide}>
```

---

## Red Flags in Code Review

| Pattern | Problem |
|---------|---------|
| `navigation.navigate` without checking layout | Will push when should show inline |
| `width: [number]` without `useLayout` | Won't adapt |
| `<Modal presentationStyle="fullScreen">` | Too aggressive on tablet |
| No `useLayout` import in screen component | Probably not responsive |
| `flexDirection: 'column'` at top level | Might need `'row'` on tablet |
| Missing selectedId state at list level | Can't highlight selected in list |

---

## Integration with PROJECT_INIT

When initializing a new project, create the `/lib/layout` directory structure immediately:

```bash
mkdir -p lib/layout
# Copy all 7 files from this guide
```

Add to initialization checklist:
- [ ] `/lib/layout/` structure created
- [ ] `useLayout()` hook available
- [ ] `LayoutShell` wrapping app root
- [ ] `useAdaptiveNavigation()` used in list screens
- [ ] `AdaptiveModal` for all modals
- [ ] Tested on compact/medium/expanded viewports
