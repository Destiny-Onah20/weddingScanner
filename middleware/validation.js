import joi from "@hapi/joi";



export const signupValidation = async (req, res, next) => {
    const signUpSchema = joi.object({
        email: joi.string()
            .email() // Optional: restrict to specific TLDs if needed
            .required()
            .messages({
                'string.base': 'Email must be a string.',
                'string.empty': 'Email is required.',
                'string.email': 'Please provide a valid email address.'
            }),
        password: joi.string()
           
            .required()
            .messages({
                'string.base': 'Password must be a string.',
                'string.empty': 'Password is required.',
               
            })
    });

  
    const { error } = signUpSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            details: error.details.map(err => err.message) // Map error messages
        });
    }

    // If validation passes, proceed to the next middleware
    next();
};
