import { forwardRef } from 'react'

// Forward Ref so we can call blur() from parent
// Maybe re-form into a basic compoment after refactoring for Context?
const VelocitySearchField = forwardRef((props, ref) => {
    const { handleChange, handleKeyDown, placeholder, searchPhrase  } = props;
    return (
        <input
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            placeholder={placeholder}
            ref={ref}
            value={searchPhrase}
        />
    );
});

export default VelocitySearchField;