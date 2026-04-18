import {ThemeBackColour} from '../../value/colour';
import {FooterPlus as SharedFooterPlus} from '@repo/ui';
import type {FooterPlusProps} from '@repo/ui';

export function FooterPlus({style, ...props}: FooterPlusProps) {
  return <SharedFooterPlus {...props} style={[ThemeBackColour(), style]} />;
}
