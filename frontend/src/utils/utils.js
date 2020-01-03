export const submitCreateUpdateForm = (validateFields, thunkFunction, domainId=null) => {
    validateFields((err, values) => {
        if (!err) {
            const data = {
                ...values,
                pk: domainId,
                manager: {pk: values.manager},
                company: {pk: values.company},
                emails: getDynamic('email', values),
                telephones: getDynamic('telephone', values),
            };
            thunkFunction(data);
        }
    });
};

const getDynamic = (field, values) => {
    return Object.keys(values)
        .filter(key => key.startsWith(field+'_'))
        .map(key => {
            const pk = key.split('_')[1];
            if (values[key])
                return { pk: parseInt(pk), [field]: values[key]};
            return undefined
        })
        .filter(i => i !== undefined );
};
