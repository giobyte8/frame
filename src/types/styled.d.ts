import 'styled-components';
import type { AppTheme } from '../theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: AppTheme['colors'];
    spacing: AppTheme['spacing'];
    radius: AppTheme['radius'];
    layout: AppTheme['layout'];
  }
}
