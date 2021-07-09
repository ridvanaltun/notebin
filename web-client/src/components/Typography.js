/**
 * This component fix below issue:
 * Warning: validateDOMnesting(...): <div> cannot appear as a descendant of <p>. See ... SomeComponent > p > ... > SomeOtherComponent > ReactTooltip > div.
 * @see https://stackoverflow.com/questions/41928567/div-cannot-appear-as-a-descendant-of-p
 */

import React from 'react'

// Components
import TypographyNode from '@material-ui/core/Typography'

const Typography = props => {
  return <TypographyNode component="div" {...props} />
}

export default Typography
