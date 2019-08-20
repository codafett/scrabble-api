import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

const typeArray = fileLoader(path.join(__dirname, './**/*.types.js'));

export const mergedTypes = mergeTypes(typeArray, { all: true });

const resolversArray = fileLoader(path.join(__dirname, './**/*.resolvers.js'));

export const mergedResolvers = mergeResolvers(resolversArray);
