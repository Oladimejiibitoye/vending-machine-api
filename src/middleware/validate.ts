import { validationPipe } from "../validation/vaildator";


export const validationMiddleware = (validationSchema) => async (req, res, next) => {
  const result : any = await validationPipe(validationSchema, { ...req.body});
  if (result.length > 0) {
      return res.status(422).json({
        message: result[0].constraints
      })
    }
    next();
};

