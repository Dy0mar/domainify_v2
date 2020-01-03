export const submitCreateUpdateForm = (validateFields, domainId, thunkFunction) => {
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
            console.log(data)
            thunkFunction(data);
        }
    });
};

const getDynamic = (field, values) => {
    return Object.keys(values)
        .filter(key => key.startsWith(field+'_'))
        .map(key => {
        const pk = key.split('_')[1];
        return {
            pk: parseInt(pk),
            email: values[key],
        }
    })
};
